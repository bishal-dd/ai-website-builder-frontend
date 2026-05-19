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
  Plus,
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
import { getRecommendedPrompts } from "@/features/preview/utils/getRecommendedPrompts";

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

const MAX_REGEN_PROMPT_LENGTH = 1000;
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
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const promptLength = input.length;
  const isPromptTooLong = promptLength > MAX_REGEN_PROMPT_LENGTH;
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
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

  const isAddingNewPage = selectedPageId === ADD_NEW_PAGE;

  const recommendedPrompts = getRecommendedPrompts(
    selectedPage?.page ?? selectedPage?.title ?? selectedPageLabel,
    isAddingNewPage,
  );

  const generalSettingsPopover = (
    <Popover
      open={isGeneralSettingsOpen}
      onOpenChange={setIsGeneralSettingsOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2.5 text-left text-sm shadow-sm transition-colors",
            "hover:border-primary/40 hover:bg-accent/40",
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Settings className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate font-medium">General Settings</span>
          </span>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              isGeneralSettingsOpen && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-80 rounded-2xl border-border/70 p-0 shadow-xl"
      >
        <div className="border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">General Settings</h3>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage site-wide settings.
          </p>
        </div>

        <div className="max-h-[320px] space-y-3 overflow-y-auto px-4 py-4">
          {generalComponents.map((component) => (
            <div
              key={component.id}
              className="rounded-xl border border-border/70 bg-background p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {component.label}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {component.id === "floating_whatsapp"
                      ? "Show or hide the floating WhatsApp button."
                      : "Change the global website font."}
                  </p>
                </div>

                {component.type === "toggle" && (
                  <button
                    type="button"
                    onClick={component.onChange}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                      component.value ? "bg-primary" : "bg-input",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
                        component.value ? "translate-x-5" : "translate-x-0.5",
                      )}
                    />
                  </button>
                )}
              </div>

              {component.type === "font" && (
                <div className="mt-3">
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
                    <SelectTrigger className="h-9 w-full rounded-lg text-xs">
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
      </PopoverContent>
    </Popover>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending || !selectedPageId || isPromptTooLong)
      return;
    const isNewPage = selectedPageId === ADD_NEW_PAGE;

    const pageLabel = isNewPage
      ? "Add Additional Page"
      : (pages.find((p) => p.page_id === selectedPageId)?.title ??
        pages.find((p) => p.page_id === selectedPageId)?.page ??
        "Unknown page");

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border/70 bg-card/95 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold leading-tight">
                Sencill AI
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                Your Personal Web Developer
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1">
        <div ref={scrollRef} className="space-y-4 px-4 py-4">
          <div className="pl-9">
            <div className="max-w-[82%]">{generalSettingsPopover}</div>
          </div>
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="shrink-0 border-t border-border/70 bg-card/95">
        <div className="max-h-[52vh] space-y-3 overflow-y-auto px-4 py-3">
          {/* Recommended Prompts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">
                Recommended prompts
              </p>

              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1">
              {recommendedPrompts.map((prompt, index) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isPending}
                  onClick={() => setInput(prompt)}
                  className={cn(
                    "group flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left text-sm leading-relaxed transition-colors",
                    "text-muted-foreground hover:bg-accent hover:text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    input === prompt && "bg-primary/10 text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-foreground transition-colors",
                      "group-hover:bg-primary group-hover:text-primary-foreground",
                      input === prompt && "bg-primary text-primary-foreground",
                    )}
                  >
                    {index + 1}
                  </span>

                  <span className="min-w-0 flex-1">{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Editing Page Selector */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex w-full items-center justify-between gap-3 rounded-xl border border-border/70 bg-background px-3 py-2.5 text-left transition-all",
                    "hover:border-primary/40 hover:bg-accent/40",
                    "focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15",
                    open &&
                      "border-primary/50 bg-accent/40 ring-2 ring-primary/15",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <SelectedIcon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Editing
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {selectedPageLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge
                      variant="secondary"
                      className="hidden rounded-md px-1.5 text-[10px] font-medium sm:inline-flex"
                    >
                      {pages.length}
                    </Badge>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
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
                  <CommandList className="max-h-[240px]">
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
                              "flex cursor-pointer items-center gap-3 px-3 py-2.5",
                              isSelected && "bg-primary/5",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <PageIcon className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
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
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedPageId === ADD_NEW_PAGE
                  ? "Describe the new page you want to create..."
                  : "Describe what you want to change on this page..."
              }
              className="min-h-[76px] max-h-[140px] resize-none rounded-xl border-border/70 bg-background text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isPending}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={isAddingNewPage ? "default" : "outline"}
                size="sm"
                disabled={isPending}
                onClick={() => {
                  if (isAddingNewPage) {
                    setSelectedPageId(currentPageId || pages[0]?.page_id || "");
                  } else {
                    setSelectedPageId(ADD_NEW_PAGE);
                  }

                  setInput("");
                  setOpen(false);
                }}
                className="h-9 min-w-0 gap-2 rounded-lg"
              >
                {isAddingNewPage ? (
                  <Layers className="h-4 w-4 shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0" />
                )}

                <span className="truncate">
                  {isAddingNewPage ? "Edit Page" : "Add Page"}
                </span>
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={
                  isPending ||
                  !input.trim() ||
                  !selectedPageId ||
                  isPromptTooLong
                }
                className="h-9 min-w-0 gap-2 rounded-lg"
              >
                <Send className="h-4 w-4 shrink-0" />
                <span className="truncate">Submit</span>
              </Button>
            </div>
          </form>

          <p
            className={cn(
              "text-[11px] leading-relaxed",
              isPromptTooLong ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {promptLength}/{MAX_REGEN_PROMPT_LENGTH} characters
            {isPromptTooLong
              ? " · Prompt is too long"
              : " · Enter to send · Shift+Enter for new line"}
          </p>
        </div>
      </div>
      {/* Regeneration Overlay */}
      {regenJobId && (
        <WebsiteRegenerator jobId={regenJobId} websiteId={websiteId} />
      )}
    </div>
  );
}
