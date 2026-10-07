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
  onSubmit: (data: {
    title: string;
    description: string;
    contact_phone: string | null;
    social_links: string | null;
  }) => Promise<void>;
}

export function WebsiteSetupModal({ open, onOpenChange, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = !title.trim() || !description.trim() || isSubmitting;

  const handleSubmit = async () => {
    if (isDisabled) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        contact_phone: contactPhone.trim() || null,
        social_links: socialLinks.trim() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Give your website a name, description, and contact details. You
              can change these details anytime from your dashboard.
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">
              {description.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone number</label>

            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Example: +975 17XXXXXX"
              className="h-11"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Social links</label>

            <Input
              value={socialLinks}
              onChange={(e) => setSocialLinks(e.target.value)}
              placeholder="Example: Instagram, Facebook, or website links"
              className="h-11"
              disabled={isSubmitting}
            />

            <p className="text-xs text-muted-foreground">Optional</p>
          </div>

          <Button
            className="h-11 w-full"
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Setting up..." : "Continue to editor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
