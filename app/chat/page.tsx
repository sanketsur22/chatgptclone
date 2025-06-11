"use client";
import { ChatInterface as ChatComponent } from "@/components/chat-interface";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

function ChatPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userId } = useAuth();
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userId={userId || ""}
        currentChatId={chatId || undefined}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <ChatComponent chatId={chatId || undefined} userId={userId || ""} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );

  // This code is now moved to ChatPageContent component
  return null;
}
