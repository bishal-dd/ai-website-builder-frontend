"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Domain } from "../types/domain";

interface DomainTransferDialogProps {
  open: boolean;
  domain: Domain | null;
  onClose: () => void;
  onSubmit: (domain: Domain, code: string) => void;
}

export function DomainTransferDialog({
  open,
  domain,
  onClose,
  onSubmit,
}: DomainTransferDialogProps) {
  const [transferCode, setTransferCode] = useState("");

  const handleSubmit = () => {
    if (!domain) return;
    onSubmit(domain, transferCode);
    setTransferCode("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Domain</DialogTitle>
          <DialogDescription>
            Transfer {domain?.name} to another registrar or provider.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Domain Name</Label>
            <Input value={domain?.name || ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label>Current Registrar</Label>
            <Input value={domain?.registrar || ""} disabled />
          </div>
          <div className="grid gap-2">
            <Label>New Registrar</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select registrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="godaddy">GoDaddy</SelectItem>
                <SelectItem value="namecheap">Namecheap</SelectItem>
                <SelectItem value="google">Google Domains</SelectItem>
                <SelectItem value="cloudflare">Cloudflare</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Authorization Code (EPP Code)</Label>
            <Input
              placeholder="Enter transfer authorization code"
              value={transferCode}
              onChange={(e) => setTransferCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get this code from your current registrar&apos;s domain management
              panel panel
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Initiate Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
