import { StreamingTextResponse } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";
import { Message } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

interface ChatRequest {
  messages: { role: string; content: string }[];
  userId?: string;
  chatId?: string;
}

export async function POST(req: Request) {
  try {
    const { messages, chatId }: ChatRequest = await req.json();
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized. Please sign in.",
        }),
        { status: 401 }
      );
    }

    // Make sure OPENAI_API_KEY environment variable is set
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY environment variable is not set",
        }),
        { status: 500 }
      );
    }

    let chat;

    // If chatId is provided, find the existing chat
    if (chatId) {
      chat = await prisma.chat.findUnique({
        where: { id: chatId },
      });

      if (!chat) {
        return new Response(JSON.stringify({ error: "Chat not found" }), {
          status: 404,
        });
      }
    } else if (userId) {
      // Create a new chat if no chatId is provided but userId is
      chat = await prisma.chat.create({
        data: {
          title: messages[0]?.content?.substring(0, 30) || "New Chat",
          userId: userId,
        },
      });
    }

    // Generate response from OpenAI
    const response = openai.completion("o3-mini", {
      messages: messages,
      stream: true,
    });
    
    // The response is already a stream
    const stream = response;

    // If we have a valid chat, save the user message
    if (chat) {
      // Save user message
      await prisma.message.create({
        data: {
          content: messages[messages.length - 1].content,
          role: messages[messages.length - 1].role,
          chatId: chat.id,
        },
      });

      // For saving the assistant's response, we'd need another approach
      // with the StreamingTextResponse, as it doesn't offer onTextContent
    }

    // Return a streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      { status: 500 }
    );
  }
}
