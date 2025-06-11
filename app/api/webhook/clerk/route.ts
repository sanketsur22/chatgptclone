import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the type
  const eventType = evt.type;

  // Handle the event
  try {
    switch (eventType) {
      case "user.created": {
        const {
          id,
          email_addresses,
          username,
          first_name,
          last_name,
          image_url,
        } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        // Create a new user in your database
        await prisma.user.create({
          data: {
            id,
            email: primaryEmail,
            name:
              `${first_name || ""} ${last_name || ""}`.trim() ||
              username ||
              undefined,
            image: image_url || undefined,
          },
        });
        break;
      }
      case "user.updated": {
        const {
          id,
          email_addresses,
          username,
          first_name,
          last_name,
          image_url,
        } = evt.data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        // Update the user in your database
        await prisma.user.update({
          where: { id },
          data: {
            email: primaryEmail,
            name:
              `${first_name || ""} ${last_name || ""}`.trim() ||
              username ||
              undefined,
            image: image_url || undefined,
          },
        });
        break;
      }
      case "user.deleted": {
        const { id } = evt.data;

        // Delete the user from your database
        await prisma.user.delete({
          where: { id },
        });
        break;
      }
      // Add other event types as needed
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
