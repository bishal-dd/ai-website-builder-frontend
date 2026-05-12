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
import useUpdateWebsite from "../hooks/useUpdateWebsite";
import useGetGeneratedWebsite from "../hooks/useGetGeneratedWebsite";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const GOOGLE_FONTS = [
  // Modern Sans
  "Inter",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Nunito",
  "Raleway",
  "Ubuntu",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Mulish",
  "Rubik",
  "Figtree",
  "Outfit",
  "Plus Jakarta Sans",

  // Elegant / Luxury
  "Playfair Display",
  "Merriweather",
  "Cormorant Garamond",
  "Libre Baskerville",
  "EB Garamond",
  "Bodoni Moda",
  "Prata",

  // Bold / Creative
  "Oswald",
  "Bebas Neue",
  "Anton",
  "Archivo Black",
  "Abril Fatface",
  "Cinzel",

  // Friendly / Startup
  "Quicksand",
  "Comfortaa",
  "Josefin Sans",
  "Cabin",
  "Karla",
  "Hind",
  "Varela Round",

  // Tech / Minimal
  "Space Grotesk",
  "Space Mono",
  "IBM Plex Sans",
  "JetBrains Mono",
  "Source Sans 3",
];
const ADD_NEW_PAGE = "add_new_page";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelJsonProps {
  onClose?: () => void;
  websiteId: string;
  font?: string;
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
  font,
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
  const [showGeneralComponents, setShowGeneralComponents] = useState(false);
  const [regenJobId, setRegenJobId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isWhatsappEnabled, setIsWhatsappEnabled] = useState(false);
  const [selectedFont, setSelectedFont] = useState(font || "Inter");
  const { mutate: updateWebsiteMutation } = useUpdateWebsite();

  /** Page selector state */
  const [selectedPageId, setSelectedPageId] = useState<string>(currentPageId);
  const { data } = useGetGeneratedWebsite(websiteId);
  const generalComponents = [
    {
      id: "floating_whatsapp",
      label: "Floating WhatsApp",
      type: "toggle",
      value: isWhatsappEnabled,
      onChange: async () => {
        const newValue = !isWhatsappEnabled;
        setIsWhatsappEnabled(newValue);

        updateWebsiteMutation({
          websiteId,
          body: {
            floating_whatsapp_enabled: newValue,
          },
        });
      },
    },
    {
      id: "font_family",
      label: "Website Font",
      type: "font",
      value: selectedFont,
    },
  ];
  useEffect(() => {
    if (data?.floating_whatsapp_enabled !== undefined) {
      setIsWhatsappEnabled(data.floating_whatsapp_enabled);
    }
    if (data?.metadata?.font_family) {
      setSelectedFont(data.metadata.font_family);
    }
  }, [data]);

  // Sync with preview page
  useEffect(() => {
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

  useEffect(() => {
    GOOGLE_FONTS.forEach((font) => {
      const id = `font-${font.replace(/\s+/g, "-")}`;

      if (document.getElementById(id)) return;

      const link = document.createElement("link");

      link.id = id;
      link.rel = "stylesheet";

      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
        / /g,
        "+",
      )}:wght@300;400;500;600;700&display=swap`;

      document.head.appendChild(link);
    });
  }, []);

  const selectedPage = pages.find((p) => p.page_id === selectedPageId);
  const selectedPageLabel =
    selectedPageId === ADD_NEW_PAGE
      ? "Add Additional Page"
      : (selectedPage?.title ?? selectedPage?.page ?? "Select page");

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
    const isNewPage = selectedPageId === ADD_NEW_PAGE;

    regenerate(
      {
        websiteId,
        pageId: isNewPage ? undefined : selectedPageId,
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
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <div
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

              {/* Show General Components Button after FIRST assistant message */}
              {index === 0 && message.role === "assistant" && (
                <div className="pl-11">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGeneralComponents((prev) => !prev)}
                  >
                    General Components
                  </Button>

                  {showGeneralComponents && (
                    <div className="mt-3 space-y-3 rounded-lg border bg-card p-4">
                      <h4 className="text-sm font-semibold">
                        Site-wide Components
                      </h4>

                      {generalComponents.map((component) => (
                        <div
                          key={component.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-muted-foreground">
                            {component.label}
                          </span>

                          {component.type === "toggle" && (
                            <button
                              type="button"
                              onClick={component.onChange}
                              className={cn(
                                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                                component.value ? "bg-primary" : "bg-input",
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                                  component.value
                                    ? "translate-x-4"
                                    : "translate-x-1",
                                )}
                              />
                            </button>
                          )}
                          {component.type === "font" && (
                            <div className="w-[220px]">
                              <Select
                                value={selectedFont}
                                onValueChange={(font) => {
                                  setSelectedFont(font);

                                  updateWebsiteMutation({
                                    websiteId,
                                    body: {
                                      font_family: font,
                                    },
                                  });
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select font" />
                                </SelectTrigger>

                                <SelectContent>
                                  {GOOGLE_FONTS.map((font) => (
                                    <SelectItem
                                      key={font}
                                      value={font}
                                      style={{
                                        fontFamily: font,
                                      }}
                                    >
                                      {font}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
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

                  {/* Divider */}
                  <div className="my-1 border-t" />

                  {/* Add New Page Option */}
                  <CommandItem
                    value={ADD_NEW_PAGE}
                    onSelect={() => {
                      setSelectedPageId(ADD_NEW_PAGE);
                      setOpen(false);
                    }}
                    className="text-primary font-medium"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Add Additional Page
                  </CommandItem>
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
            placeholder={
              selectedPageId === ADD_NEW_PAGE
                ? "Describe the new page you want to create..."
                : "Describe what you want to change on this page..."
            }
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
