import { prisma } from "./prisma";

/**
 * Create a new chat in the database
 */
export async function createChat(userId: string, title: string) {
  return prisma.chat.create({
    data: {
      title: title || "New Chat",
      userId,
    },
  });
}

/**
 * Add a message to a chat
 */
export async function addMessage(
  chatId: string,
  content: string,
  role: string
) {
  return prisma.message.create({
    data: {
      content,
      role,
      chatId,
    },
  });
}

/**
 * Get all chats for a user
 */
export async function getChats(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/**
 * Get a single chat with its messages
 */
export async function getChat(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/**
 * Update a chat's title
 */
export async function updateChatTitle(chatId: string, title: string) {
  return prisma.chat.update({
    where: { id: chatId },
    data: { title },
  });
}

/**
 * Delete a chat and all its messages
 */
export async function deleteChat(chatId: string) {
  return prisma.chat.delete({
    where: { id: chatId },
  });
}
