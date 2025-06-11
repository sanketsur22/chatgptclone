// Common types for the ChatGPT clone application

// User type
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Message type
export interface Message {
  id: string;
  content: string;
  role: string; // "user" | "assistant" | "system"
  createdAt: string | Date;
  chatId: string;
}

// Chat type
export interface Chat {
  id: string;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  messages?: Message[];
}

// API Response types
export interface ChatResponse {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: Message[];
}

export interface ErrorResponse {
  error: string;
}
