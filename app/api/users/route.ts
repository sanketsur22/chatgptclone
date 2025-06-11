import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

// Route for user operations
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const clerkUser = await currentUser();

    if (
      !clerkUser ||
      !clerkUser.emailAddresses ||
      clerkUser.emailAddresses.length === 0
    ) {
      return NextResponse.json(
        { error: "User email not available" },
        { status: 400 }
      );
    }

    const email = clerkUser.emailAddresses[0].emailAddress;
    const name =
      clerkUser.firstName && clerkUser.lastName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.username || email.split("@")[0];
    const image = clerkUser.imageUrl;
    const userId = session.userId;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        image,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing user data" },
      { status: 500 }
    );
  }
}

// Get user data
export async function GET(req: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the user in our database using Clerk's user ID
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        chats: {
          orderBy: { updatedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      // If the user doesn't exist in our database yet, create them
      const clerkUser = await currentUser();

      if (
        !clerkUser ||
        !clerkUser.emailAddresses ||
        clerkUser.emailAddresses.length === 0
      ) {
        return NextResponse.json(
          { error: "User email not available" },
          { status: 400 }
        );
      }

      const email = clerkUser.emailAddresses[0].emailAddress;
      const name =
        clerkUser.firstName && clerkUser.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.username || email.split("@")[0];

      const newUser = await prisma.user.create({
        data: {
          id: session.userId,
          email,
          name,
          image: clerkUser.imageUrl,
        },
        include: {
          chats: true,
        },
      });

      return NextResponse.json(newUser);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user data" },
      { status: 500 }
    );
  }
}
