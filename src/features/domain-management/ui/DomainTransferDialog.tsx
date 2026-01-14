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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  onSubmit: (
    domain: Domain,
    payload: {
      newRegistrar?: string;
      reason?: string;
    },
  ) => void;
}

export function DomainTransferDialog({
  open,
  domain,
  onClose,
  onSubmit,
}: DomainTransferDialogProps) {
  const [newRegistrar, setNewRegistrar] = useState<string | undefined>();
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const handleSubmit = () => {
    if (!domain || !acknowledged) return;

    onSubmit(domain, {
      newRegistrar,
      reason,
    });

    setNewRegistrar(undefined);
    setReason("");
    setAcknowledged(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Request Domain Transfer</DialogTitle>
          <DialogDescription>
            This will start a manual transfer process. Our team will unlock the
            domain and provide you with an authorization (EPP) code.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Domain</Label>
            <Input value={domain?.name || ""} disabled />
          </div>

          <div className="grid gap-2">
            <Label>New Registrar (optional)</Label>
            <Select onValueChange={setNewRegistrar}>
              <SelectTrigger>
                <SelectValue placeholder="Select registrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="namecheap">Namecheap</SelectItem>
                <SelectItem value="godaddy">GoDaddy</SelectItem>
                <SelectItem value="google">Google Domains</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Let us know why you are transferring this domain"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="ack"
              checked={acknowledged}
              onCheckedChange={(v: boolean) => setAcknowledged(!!v)}
            />
            <Label htmlFor="ack" className="text-sm leading-relaxed">
              I understand this domain will no longer be managed by Sencill AI
              and I will be responsible for completing the transfer at my new
              registrar.
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!acknowledged}
            onClick={handleSubmit}
          >
            Request Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
