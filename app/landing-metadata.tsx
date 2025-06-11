import { Metadata } from "next";

export const landingPageMetadata: Metadata = {
  title: "ChatGPT Clone - Advanced AI Assistant",
  description:
    "Experience the most advanced AI assistant with a beautiful, intuitive interface. Get instant answers, creative solutions, and intelligent insights.",
  keywords: [
    "AI assistant",
    "ChatGPT",
    "AI conversations",
    "AI chat",
    "GPT-4",
    "Natural language processing",
  ],
  openGraph: {
    title: "ChatGPT Clone - Advanced AI Assistant",
    description:
      "Experience the most advanced AI assistant with a beautiful, intuitive interface.",
    url: "https://chatgpt-clone.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT Clone - Advanced AI Assistant",
    description:
      "Experience the most advanced AI assistant with a beautiful, intuitive interface.",
    images: ["/twitter-image.png"],
  },
};
