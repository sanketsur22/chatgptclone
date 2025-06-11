import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Route for user operations
export async function POST(req: Request) {
  try {
    const { email, name, image } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        image: image || null,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing user data" },
      { status: 500 }
    );
  }
}

// Get user by email
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        chats: {
          orderBy: { updatedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
