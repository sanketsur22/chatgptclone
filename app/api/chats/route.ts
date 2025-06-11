import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
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
    const { userId, title } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
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
