import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1, // Just get the first message for a preview
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Get chats error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching chats" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const chat = await prisma.chat.create({
      data: {
        title: title || "New Chat",
        userId,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the chat" },
      { status: 500 }
    );
  }
}
