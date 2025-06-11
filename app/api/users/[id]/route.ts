import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UserParams {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: UserParams) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        chats: {
          orderBy: { updatedAt: "desc" },
          take: 10,
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

export async function PUT(req: Request, { params }: UserParams) {
  try {
    const { id } = params;
    const { name, image } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating user data" },
      { status: 500 }
    );
  }
}
