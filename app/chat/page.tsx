"use client";
import { ChatInterface as ChatComponent } from "@/components/chat-interface";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth-utils";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");

  // Initialize the user ID
  useEffect(() => {
    setUserId(getCurrentUserId());
  }, []);
  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userId={userId || undefined}
        currentChatId={chatId || undefined}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <ChatComponent
          chatId={chatId || undefined}
          userId={userId || undefined}
        />
      </div>
    </div>
  );
}
