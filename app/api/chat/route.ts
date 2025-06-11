import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";
import { Message } from "@/lib/types";

interface ChatRequest {
  messages: { role: string; content: string }[];
  userId?: string;
  chatId?: string;
}

export async function POST(req: Request) {
  try {
    const { messages, userId, chatId }: ChatRequest = await req.json();

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
    const { result } = await generateText({
      model: openai("o3-mini"),
      // system: "You are a friendly assistant!",
      messages: messages,
    });

    // If we have a valid chat, save the user message and the assistant's response
    if (chat) {
      // Save user message
      await prisma.message.create({
        data: {
          content: messages[messages.length - 1].content,
          role: messages[messages.length - 1].role,
          chatId: chat.id,
        },
      });

      // We'll save the assistant's response after we get it
      result.onTextContent((content: string) => {
        prisma.message
          .create({
            data: {
              content: content,
              role: "assistant",
              chatId: chat.id,
            },
          })
          .catch((error: Error) =>
            console.error("Error saving assistant message:", error)
          );
      });
    }

    return result.toDataStreamResponse();
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
