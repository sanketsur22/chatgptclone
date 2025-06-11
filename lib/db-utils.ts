import { prisma } from "./prisma";

/**
 * Get or create a user by their email
 * @param email User's email
 * @param name User's name (optional)
 * @param image User's profile image URL (optional)
 * @returns The user object
 */
export async function getOrCreateUser(
  email: string,
  name?: string,
  image?: string
) {
  try {
    // Try to find the user first
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          image: image || null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw error;
  }
}

/**
 * Get all chats for a user
 * @param userId User ID
 * @returns Array of chat objects
 */
export async function getUserChats(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return chats;
  } catch (error) {
    console.error("Error in getUserChats:", error);
    throw error;
  }
}

/**
 * Get a chat with all its messages
 * @param chatId Chat ID
 * @returns Chat object with messages
 */
export async function getChat(chatId: string) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return chat;
  } catch (error) {
    console.error("Error in getChat:", error);
    throw error;
  }
}
