"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Send,
  Sparkles,
  User,
  X,
  ChevronDown,
  Check,
  Home,
  Info,
  Mail,
  Settings,
  ShoppingCart,
  Users,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegenerateWebsite } from "../hooks/useRegenerateWebsite";
import { WebsiteRegenerator } from "./WebsiteRegenerator";
import { WebPages } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelJsonProps {
  onClose?: () => void;
  websiteId: string;
  pages: WebPages[];
  currentPageId: string;
}

// Map page names to appropriate icons
function getPageIcon(pageName: string) {
  const name = pageName.toLowerCase();
  if (name.includes("home") || name === "index" || name === "/") return Home;
  if (name.includes("about")) return Info;
  if (name.includes("contact")) return Mail;
  if (name.includes("setting")) return Settings;
  if (
    name.includes("cart") ||
    name.includes("shop") ||
    name.includes("product")
  )
    return ShoppingCart;
  if (name.includes("team") || name.includes("user")) return Users;
  return Layers;
}

export function ChatPanelJson({
  onClose,
  websiteId,
  pages,
  currentPageId,
}: ChatPanelJsonProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'll help you improve this website. Choose a page and describe what you want to change.",
    },
  ]);

  const [input, setInput] = useState("");
  const [regenJobId, setRegenJobId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  /** Page selector state */
  const [selectedPageId, setSelectedPageId] = useState<string>(currentPageId);

  // Sync with preview page
  useEffect(() => {
    console.log("Syncing page ID:", currentPageId);
    setSelectedPageId(currentPageId);
  }, [currentPageId]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: regenerate, isPending } = useRegenerateWebsite();

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedPage = pages.find((p) => p.page_id === selectedPageId);
  const selectedPageLabel =
    selectedPage?.title ?? selectedPage?.page ?? "Select page";
  const SelectedIcon = getPageIcon(selectedPageLabel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending || !selectedPageId) return;

    const pageLabel =
      pages.find((p) => p.page_id === selectedPageId)?.title ??
      pages.find((p) => p.page_id === selectedPageId)?.page ??
      "Unknown page";

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `[${pageLabel}] ${input}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    console.log("Selected page ID:", selectedPageId);
    regenerate(
      {
        websiteId,
        pageId: selectedPageId,
        userMessage: input,
      },
      {
        onSuccess: (data) => {
          if (data.jobId) {
            setRegenJobId(data.jobId);
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content:
                  "✅ Changes are being applied to this page. Updating preview…",
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
            },
          ]);
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sencill AI</h2>
            <p className="text-sm text-muted-foreground">
              Page-aware assistant
            </p>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border",
                )}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Page Selector + Input */}
      <div className="border-t border-border bg-card px-6 py-4 space-y-3">
        {/* Modern Page Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-left transition-all duration-200",
                "hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                open &&
                  "border-primary/50 bg-accent/50 shadow-sm ring-2 ring-primary/20",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    "bg-primary/10 text-primary",
                    "group-hover:bg-primary/15",
                  )}
                >
                  <SelectedIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Editing Page
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {selectedPageLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-medium">
                  {pages.length} {pages.length === 1 ? "page" : "pages"}
                </Badge>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            sideOffset={8}
          >
            <Command>
              <CommandInput placeholder="Search pages..." />
              <CommandList>
                <CommandEmpty>No pages found.</CommandEmpty>
                <CommandGroup>
                  {pages.map((page) => {
                    const pageLabel = page.title ?? page.page;
                    const PageIcon = getPageIcon(pageLabel);
                    const isSelected = page.page_id === selectedPageId;

                    return (
                      <CommandItem
                        key={page.page_id}
                        value={pageLabel}
                        onSelect={() => {
                          setSelectedPageId(page.page_id);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 cursor-pointer",
                          isSelected && "bg-primary/5",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <PageIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "truncate text-sm font-medium",
                              isSelected && "text-primary",
                            )}
                          >
                            {pageLabel}
                          </p>
                          {page.page && page.title && (
                            <p className="truncate text-xs text-muted-foreground">
                              /{page.page}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to change on this page…"
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
            disabled={isPending || !input.trim() || !selectedPageId}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Regeneration Overlay */}
      {regenJobId && (
        <WebsiteRegenerator jobId={regenJobId} websiteId={websiteId} />
      )}
    </div>
  );
}
