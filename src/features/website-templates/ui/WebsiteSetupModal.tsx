"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

export function WebsiteSetupModal({ open, onOpenChange, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isDisabled = !title.trim() || !description.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-120"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="space-y-4">
          <div className="space-y-2">
            <DialogTitle className="text-xl">
              Customize your website
            </DialogTitle>

            <DialogDescription>
              Give your website a name and description. You can change these
              details anytime from your dashboard.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Website name</label>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Sencill AI"
              className="h-11"
              maxLength={50}
            />

            <p className="text-xs text-muted-foreground">
              {title.length}/50 characters
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website description</label>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your website is about..."
              className="min-h-30 resize-none"
              maxLength={200}
            />

            <p className="text-xs text-muted-foreground">
              {description.length}/200 characters
            </p>
          </div>

          <Button
            className="h-11 w-full"
            disabled={isDisabled}
            onClick={() => {
              onSubmit({
                title,
                description,
              });

              onOpenChange(false);
            }}
          >
            Continue to editor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
