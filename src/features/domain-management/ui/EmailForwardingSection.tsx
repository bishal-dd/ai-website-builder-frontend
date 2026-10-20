"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfigureDomainEmailForwarding } from "../hooks/useConfigureDomainEmailForwarding";

interface EmailForwardingSectionProps {
  domainId: string;
  domainName: string;
}

export function EmailForwardingSection({
  domainId,
  domainName,
}: EmailForwardingSectionProps) {
  const [mailbox, setMailbox] = useState("contact");
  const [forwardTo, setForwardTo] = useState("");

  const { configureEmailForwarding, isConfiguring, error, isSuccess, reset } =
    useConfigureDomainEmailForwarding();

  const normalizedDomain = domainName.trim().toLowerCase();
  const normalizedMailbox = mailbox.trim().toLowerCase();
  const normalizedForwardTo = forwardTo.trim();

  const isValidMailbox = /^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?$/i.test(
    normalizedMailbox,
  );

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedForwardTo);

  const canSubmit =
    Boolean(domainId) &&
    Boolean(normalizedDomain) &&
    isValidMailbox &&
    isValidEmail &&
    !isConfiguring;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) return;

    configureEmailForwarding(
      {
        domainId,
        data: {
          mailbox: normalizedMailbox,
          forwardTo: normalizedForwardTo,
        },
      },
      {
        onSuccess: () => {
          setForwardTo("");
        },
      },
    );
  };

  const handleInputChange = (callback: (value: string) => void) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      callback(event.target.value);
      reset();
    };
  };

  return (
    <Card className="border-muted/80 bg-background/60 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Mail className="size-5 text-primary" />
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-bold tracking-tight">Email Forwarding</h4>

          <p className="mt-1 text-xs text-muted-foreground">
            Create a custom email address that forwards incoming messages to
            your personal inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor={`forwarding-mailbox-${domainId}`}
            className="text-sm font-medium"
          >
            Custom email address
          </label>

          <div className="flex min-w-0 items-center gap-2">
            <Input
              id={`forwarding-mailbox-${domainId}`}
              value={mailbox}
              onChange={handleInputChange(setMailbox)}
              placeholder="contact"
              autoComplete="off"
              maxLength={64}
              aria-invalid={mailbox.length > 0 && !isValidMailbox}
              disabled={isConfiguring}
              required
            />

            <span className="shrink-0 text-sm text-muted-foreground">
              @{normalizedDomain || "yourdomain.com"}
            </span>
          </div>

          {mailbox.length > 0 && !isValidMailbox && (
            <p className="text-xs text-destructive">
              Enter a valid mailbox name using letters, numbers, dots,
              underscores, plus signs, or hyphens.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`forwarding-destination-${domainId}`}
            className="text-sm font-medium"
          >
            Forward messages to
          </label>

          <Input
            id={`forwarding-destination-${domainId}`}
            type="email"
            value={forwardTo}
            onChange={handleInputChange(setForwardTo)}
            placeholder="you@gmail.com"
            autoComplete="email"
            maxLength={254}
            aria-invalid={forwardTo.length > 0 && !isValidEmail}
            disabled={isConfiguring}
            required
          />

          <p className="text-xs text-muted-foreground">
            Messages sent to {normalizedMailbox || "your alias"}@
            {normalizedDomain || "yourdomain.com"} will be forwarded to this
            address.
          </p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Email forwarding requires compatible DNS settings and the correct MX
            records. This feature forwards incoming messages; it does not
            provide a full mailbox or outgoing email service.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error instanceof Error
              ? error.message
              : "We couldn't configure email forwarding. Please try again."}{" "}
          </div>
        )}

        {isSuccess && (
          <div
            role="status"
            className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-700 dark:text-green-400"
          >
            Forwarding rule configured successfully. DNS configuration may still
            be required before incoming messages will arrive.
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={!canSubmit}>
            {isConfiguring ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="mr-2 size-4" />
            )}

            {isConfiguring ? "Configuring..." : "Set up forwarding"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
