import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface ChatParams {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: ChatParams) {
  try {
    const { id } = params;
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id,
        userId, // Ensure the chat belongs to the authenticated user
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the chat" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: ChatParams) {
  try {
    const { id } = params;
    const { title } = await req.json();

    const updatedChat = await prisma.chat.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Update chat error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: ChatParams) {
  try {
    const { id } = params;

    await prisma.chat.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the chat" },
      { status: 500 }
    );
  }
}
