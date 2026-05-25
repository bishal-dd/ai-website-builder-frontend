import { ChevronDown, FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeletePageAction } from "@/features/preview/ui/panel/DeletePageAction";
import type { PreviewPage } from "@/features/preview/types/previewPanel";
import { canDeletePage } from "@/features/preview/utils/previewPanel";

interface PageSelectorProps {
  mainPages: PreviewPage[];
  groupedSubPages: Record<string, PreviewPage[]>;
  currentPageId: string;
  isDeletingPage: boolean;
  onPageChange: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
}

export function PageSelector({
  mainPages,
  groupedSubPages,
  currentPageId,
  isDeletingPage,
  onPageChange,
  onDeletePage,
}: PageSelectorProps) {
  return (
    <div className="border-b bg-card px-4 py-2">
      <ScrollArea>
        <div className="flex gap-2">
          {mainPages.map((mainPage) => {
            const subPages = groupedSubPages[mainPage.page] || [];
            const hasSubPages = subPages.length > 0;

            const isActive =
              currentPageId === mainPage.page_id ||
              subPages.some((subPage) => subPage.page_id === currentPageId);

            if (hasSubPages) {
              return (
                <DropdownMenu key={mainPage.page_id}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      className="gap-2"
                    >
                      <FileText className="h-3 w-3" />

                      {subPages.find(
                        (subPage) => subPage.page_id === currentPageId,
                      )?.title || mainPage.title}

                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" className="w-60">
                    <DropdownMenuItem
                      onSelect={(event) => event.preventDefault()}
                      className="flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => onPageChange(mainPage.page_id)}
                        className="flex-1 text-left"
                      >
                        {mainPage.title} (Overview)
                      </button>

                      {canDeletePage(mainPage.page) && (
                        <DeletePageAction
                          title="Delete this page?"
                          description="This page will be removed from your website preview."
                          disabled={isDeletingPage}
                          onDelete={() => onDeletePage(mainPage.page_id)}
                        >
                          <button
                            type="button"
                            disabled={isDeletingPage}
                            className="rounded-sm p-1 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </DeletePageAction>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {subPages.map((subPage) => (
                      <DropdownMenuItem
                        key={subPage.page_id}
                        onSelect={(event) => event.preventDefault()}
                        className="flex items-center justify-between gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => onPageChange(subPage.page_id)}
                          className="flex-1 text-left"
                        >
                          {subPage.title}
                        </button>

                        {canDeletePage(subPage.page) && (
                          <DeletePageAction
                            title="Delete this subpage?"
                            description="This subpage will be removed from your website preview."
                            disabled={isDeletingPage}
                            onDelete={() => onDeletePage(subPage.page_id)}
                          >
                            <button
                              type="button"
                              disabled={isDeletingPage}
                              className="rounded-sm p-1 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </DeletePageAction>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <div key={mainPage.page_id} className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={
                    currentPageId === mainPage.page_id ? "default" : "outline"
                  }
                  onClick={() => onPageChange(mainPage.page_id)}
                >
                  <FileText className="mr-1 h-3 w-3" />
                  {mainPage.title}
                </Button>

                {canDeletePage(mainPage.page) && (
                  <DeletePageAction
                    title="Delete this page?"
                    description="This page will be removed from your website preview."
                    disabled={isDeletingPage}
                    onDelete={() => onDeletePage(mainPage.page_id)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
