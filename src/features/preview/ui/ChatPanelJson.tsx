"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegenerateWebsite } from "../hooks/useRegenerateWebsite";
import { WebsiteRegenerator } from "./WebsiteRegenerator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatPanelJsonProps {
  onClose?: () => void;
  websiteId: string;
}

export function ChatPanelJson({ onClose, websiteId }: ChatPanelJsonProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm sencill AI. Tell me about the website you'd like to create. What type of business is it for?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [regenJobId, setRegenJobId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: regenerate, isPending } = useRegenerateWebsite();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Call regenerate API
    regenerate(
      { websiteId, userMessage: userMessage.content },
      {
        onSuccess: (data) => {
          if (data.jobId) {
            setRegenJobId(data.jobId);

            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "✅ Website regeneration started. Updating preview...",
                timestamp: new Date(),
              },
            ]);
          }
        },
        onError: (err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 2).toString(),
              role: "assistant",
              content: `❌ Failed: ${errorMessage}`,
              timestamp: new Date(),
            },
          ]);
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              sencill AI
            </h2>
            <p className="text-sm text-muted-foreground">Website Generator</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border",
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="mt-1 block text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border bg-card px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your website or ask to add a new page..."
            className="min-h-[60px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      {/* Regeneration Overlay */}
      {regenJobId && (
        <WebsiteRegenerator
          jobId={regenJobId}
          websiteId={websiteId} // dynamic
        />
      )}
    </div>
  );
}
