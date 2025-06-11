// Seed script for development data
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed operation...");

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create a sample chat
  const chat = await prisma.chat.create({
    data: {
      title: "Welcome Chat",
      userId: user.id,
      messages: {
        create: [
          {
            content: "Hello! How can I help you today?",
            role: "assistant",
          },
          {
            content: "Tell me about MongoDB and Prisma.",
            role: "user",
          },
          {
            content:
              "MongoDB is a NoSQL document database that stores data in JSON-like documents. Prisma is a modern ORM (Object-Relational Mapping) tool that helps developers work with databases using type-safe queries. Together, they provide a powerful combination for building full-stack applications. Prisma simplifies database operations and provides type safety, while MongoDB offers flexibility with JSON documents and scalability for modern applications.",
            role: "assistant",
          },
        ],
      },
    },
  });

  console.log(`Created chat with id: ${chat.id}`);

  console.log("Seed operation completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed operation:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
