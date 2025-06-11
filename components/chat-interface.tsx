"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Check,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@ai-sdk/react";
import { ChatResponse, Message as ChatMessage } from "@/lib/types";

interface ChatInterfaceProps {
  chatId?: string;
  userId?: string;
}

export function ChatInterface({ chatId, userId }: ChatInterfaceProps) {
  const { user } = useUser();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: { chatId, userId }, // Pass chatId and userId to API
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Load chat history when a chatId is provided
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId) return;

      setIsLoadingHistory(true);
      try {
        const response = await fetch(`/api/chats/${chatId}`);

        if (!response.ok) {
          throw new Error("Failed to load chat history");
        }

        const chatData = await response.json();

        if (chatData.messages && chatData.messages.length > 0) {
          // Convert to the format expected by useChat
          const formattedMessages = chatData.messages.map(
            (msg: ChatMessage) => ({
              id: msg.id,
              content: msg.content,
              role: msg.role,
            })
          );

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [chatId, setMessages, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    setIsTyping(status === "streaming");
  }, [status]);

  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      adjustEditTextareaHeight();
    }
  }, [editingMessageId]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || status === "streaming") {
      console.log("Cannot submit: input empty or streaming");
      return;
    }

    console.log("Submitting message:", input);

    try {
      await handleSubmit(e);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description:
          "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
      }
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${maxHeight}px`;
    }
  };

  const adjustEditTextareaHeight = () => {
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = "auto";
      const maxHeight = Math.min(editTextareaRef.current.scrollHeight, 200);
      editTextareaRef.current.style.height = `${maxHeight}px`;
    }
  };

  const startEditing = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editingContent.trim()) return;

    try {
      // Find the message index
      const messageIndex = messages.findIndex((m) => m.id === editingMessageId);
      if (messageIndex === -1) return;

      // Create new messages array with the edited message
      const newMessages = [...messages];
      newMessages[messageIndex] = {
        ...newMessages[messageIndex],
        content: editingContent.trim(),
      };

      // Remove all messages after the edited one (since we need to regenerate the conversation)
      const messagesToKeep = newMessages.slice(0, messageIndex + 1);

      // Update the messages
      setMessages(messagesToKeep);

      // Clear editing state
      setEditingMessageId(null);
      setEditingContent("");

      // If the edited message was a user message, regenerate the AI response
      if (newMessages[messageIndex].role === "user") {
        // Create a synthetic form submission to regenerate the response
        const syntheticEvent = {
          preventDefault: () => {},
          target: {
            elements: {
              prompt: { value: editingContent.trim() },
            },
          },
        } as any;

        // Temporarily set the input to the edited content
        const originalInput = input;
        handleInputChange({ target: { value: editingContent.trim() } } as any);

        // Submit to regenerate response
        setTimeout(async () => {
          await handleSubmit(syntheticEvent);
          // Restore original input
          handleInputChange({ target: { value: originalInput } } as any);
        }, 100);
      }

      toast({
        title: "Message updated",
        description: "Your message has been successfully edited.",
      });
    } catch (error) {
      console.error("Error editing message:", error);
      toast({
        title: "Error",
        description: "Failed to edit message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  useEffect(() => {
    adjustEditTextareaHeight();
  }, [editingContent]);

  const examplePrompts = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the benefits of TypeScript?",
    "Help me plan a weekend trip to Paris",
  ];

  const handleExampleClick = (prompt: string) => {
    if (textareaRef.current) {
      const syntheticEvent = {
        target: { value: prompt },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(syntheticEvent);
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Chat Messages */}
      <ScrollArea
        className="flex-1 p-4 custom-scrollbar overflow-auto"
        style={{ height: "calc(100vh - 140px)" }}
        ref={scrollAreaRef}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                I'm here to assist you with questions, writing, analysis, math,
                coding, and more.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {examplePrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:bg-accent transition-colors border-dashed"
                    onClick={() => handleExampleClick(prompt)}
                  >
                    <p className="text-sm text-foreground">{prompt}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 message-enter ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`group max-w-3xl px-4 py-3 rounded-2xl relative ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-12"
                    : "bg-card text-card-foreground border mr-12"
                }`}
              >
                {editingMessageId === message.id ? (
                  <div className="space-y-3">
                    <Textarea
                      ref={editTextareaRef}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="w-full min-h-[60px] resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-foreground"
                      placeholder="Edit your message..."
                    />
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={!editingContent.trim()}
                              className="h-7 px-2"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save changes (Enter)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="h-7 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancel (Esc)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap break-words">
                      {message.parts?.map((part, i) => {
                        if (part.type === "text") {
                          return <span key={i}>{part.text}</span>;
                        }
                        return null;
                      }) ?? message.content}
                    </div>

                    <div className="flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.role === "user" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const textContent = message.parts
                                    ? message.parts
                                        .filter((part) => part.type === "text")
                                        .map((part) => part.text)
                                        .join("")
                                    : message.content;
                                  startEditing(message.id, textContent);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const textContent = message.parts
                                  ? message.parts
                                      .filter((part) => part.type === "text")
                                      .map((part) => part.text)
                                      .join("")
                                  : message.content;
                                copyToClipboard(textContent);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {message.role === "assistant" && (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Good response</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Poor response</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 bg-primary flex-shrink-0">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="w-4 h-4 text-primary-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-4 message-enter">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500">
                <AvatarFallback>
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-3xl px-4 py-3 rounded-2xl bg-card border">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex justify-center">
              <Card className="p-4 border-destructive">
                <p className="text-destructive text-sm">
                  Error: Something went wrong. Please try again.
                </p>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4 sticky bottom-0 w-full">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={onSubmit} className="relative">
            <div className="flex items-end space-x-3 bg-muted rounded-2xl p-3">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message ChatGPT Clone..."
                className="flex-1 min-h-[24px] max-h-[120px] resize-none border-0 bg-transparent focus:ring-0 focus:outline-none text-foreground placeholder-muted-foreground overflow-auto"
                rows={1}
                disabled={status !== "ready"}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!input.trim() || status !== "ready"}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-3 py-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
