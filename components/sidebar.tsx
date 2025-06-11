"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageSquare, Plus, Settings, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  currentChatId?: string;
}

interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function Sidebar({
  isOpen,
  onClose,
  userId,
  currentChatId,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch chats from API when component mounts or userId changes
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/chats?userId=${userId}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setConversations(data);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  const handleNewChat = () => {
    if (userId) {
      // Navigate to chat page without ID to create a new chat
      window.location.href = "/chat";
    } else {
      window.location.reload();
    }
    onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:bg-card md:border-r md:border-border">
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <Separator />

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Recent Conversations
            </h3>
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading chats...
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Button
                  key={conversation.id}
                  variant={
                    conversation.id === currentChatId ? "secondary" : "ghost"
                  }
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() =>
                    (window.location.href = `/chat?id=${conversation.id}`)
                  }
                >
                  <div className="flex items-start space-x-2 w-full">
                    <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(conversation.updatedAt),
                          "MMM d, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                </Button>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Conversations
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="p-4">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>

          <Separator />

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Recent Conversations
              </h3>
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading chats...
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant={
                      conversation.id === currentChatId ? "secondary" : "ghost"
                    }
                    className="w-full justify-start h-auto p-3 text-left"
                    onClick={() => {
                      window.location.href = `/chat?id=${conversation.id}`;
                      onClose();
                    }}
                  >
                    <div className="flex items-start space-x-2 w-full">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(conversation.updatedAt),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No conversations yet
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Conversations
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
