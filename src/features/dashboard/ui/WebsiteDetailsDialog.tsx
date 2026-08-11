"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Globe, FileText, Phone, Mail } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  initialDescription: string;
  initialEmail: string;
  initialPhone: string;
  onSave: (data: {
    title: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
  }) => void;
}

export function WebsiteDetailsDialog({
  open,
  onOpenChange,
  initialName,
  initialDescription,
  initialEmail,
  initialPhone,
  onSave,
}: Props) {
  const [title, setTitle] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);

  useEffect(() => {
    if (open) {
      setTitle(initialName);
      setDescription(initialDescription);
      setEmail(initialEmail);
      setPhone(initialPhone);
    }
  }, [open, initialName, initialDescription, initialEmail, initialPhone]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, description, contactEmail: email, contactPhone: phone });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-120 p-6 gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Update website details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the name and description of your website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium flex items-center gap-2 text-foreground/90"
            >
              <Globe className="size-4 text-muted-foreground" />
              Website Name
            </Label>
            <Input
              id="title"
              placeholder="e.g., My Awesome Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 focus-visible:ring-primary/50"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium flex items-center gap-2 text-foreground/90"
            >
              <FileText className="size-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what this website does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-27.5 resize-none focus-visible:ring-primary/50 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium flex items-center gap-2 text-foreground/90"
            >
              <Mail className="size-4 text-muted-foreground" />
              Contact Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium flex items-center gap-2 text-foreground/90"
            >
              <Phone className="size-4 text-muted-foreground" />
              Contact Phone
            </Label>

            <Input
              id="phone"
              type="tel"
              placeholder="+975 17XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 focus-visible:ring-primary/50"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t pt-4 border-border/40">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="w-full sm:w-auto shadow-sm"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
