"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Inbox,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useConfigureDomainEmailForwarding } from "../hooks/useConfigureDomainEmailForwarding";
import { useGetDomainEmailForwarding } from "../hooks/useGetDomainEmailForwarding";

interface EmailForwardingSectionProps {
  domainId: string;
  domainName: string;
}

const isValidMailbox = (value: string) =>
  /^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?$/i.test(value);

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function EmailForwardingSection({
  domainId,
  domainName,
}: EmailForwardingSectionProps) {
  const [mailbox, setMailbox] = useState("contact");
  const [forwardTo, setForwardTo] = useState("");

  const {
    configureEmailForwarding,
    isConfiguring,
    error: mutationError,
    isSuccess: isConfigureSuccess,
    reset,
  } = useConfigureDomainEmailForwarding();

  const {
    data,
    isLoading,
    isFetching,
    isError: isQueryError,
    error: queryError,
    refetch,
  } = useGetDomainEmailForwarding(domainId);

  const normalizedDomain = domainName.trim().toLowerCase();
  const normalizedMailbox = mailbox.trim().toLowerCase();
  const normalizedForwardTo = forwardTo.trim();

  const mailboxIsValid =
    normalizedMailbox.length > 0 && isValidMailbox(normalizedMailbox);

  const emailIsValid =
    normalizedForwardTo.length > 0 && isValidEmail(normalizedForwardTo);

  const canSubmit =
    Boolean(domainId) &&
    Boolean(normalizedDomain) &&
    mailboxIsValid &&
    emailIsValid &&
    !isConfiguring;

  const rules = data?.forwardingRules ?? [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

  const handleInputChange =
    (callback: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      callback(event.target.value);
      reset();
    };

  return (
    <Card className="overflow-hidden border-muted/80 bg-background">
      {/* Header */}
      <div className="flex items-start gap-3 border-b px-5 py-5 sm:px-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Mail className="size-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight">
            Email forwarding
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Create custom email addresses for your domain and forward incoming
            messages to an existing inbox.
          </p>

          <p className="mt-2 break-all text-sm font-medium">
            {normalizedDomain || "Your domain"}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          onClick={() => void refetch()}
          disabled={isFetching || !domainId}
          aria-label="Refresh forwarding rules"
          title="Refresh forwarding rules"
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {/* Existing forwarding rules */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold">Your forwarding rules</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Addresses currently configured with your domain.
              </p>
            </div>

            {!isLoading && !isQueryError && (
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {rules.length} {rules.length === 1 ? "rule" : "rules"}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading forwarding rules...
            </div>
          ) : isQueryError ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Unable to load rules</p>
                <p className="mt-1 break-words text-xs text-muted-foreground">
                  {queryError instanceof Error
                    ? queryError.message
                    : "Something went wrong while loading forwarding rules."}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Try again
                </Button>
              </div>
            </div>
          ) : rules.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed px-4 py-7 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Inbox className="size-5 text-muted-foreground" />
              </div>

              <p className="mt-3 text-sm font-medium">
                No forwarding rules yet
              </p>

              <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                Create your first custom email address below to start forwarding
                incoming messages.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rules.map((rule) => (
                <div
                  key={rule.mailbox}
                  className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium">
                      {rule.mailbox}@{data?.domain || normalizedDomain}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="size-3 shrink-0" />
                      <span className="break-all">{rule.forwardTo}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    Configured
                  </div>
                </div>
              ))}
            </div>
          )}

          {isFetching && !isLoading && (
            <p className="text-xs text-muted-foreground">
              Refreshing forwarding rules...
            </p>
          )}
        </section>

        <div className="border-t" />

        {/* Add or update a forwarding rule */}
        <section className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="size-4 text-primary" />
            </div>

            <div>
              <h4 className="text-sm font-semibold">
                Add a forwarding address
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Use an alias such as contact, info, or support. If the alias
                already exists, this will update its destination.
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

              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id={`forwarding-mailbox-${domainId}`}
                  value={mailbox}
                  onChange={handleInputChange(setMailbox)}
                  placeholder="contact"
                  autoComplete="off"
                  maxLength={64}
                  aria-invalid={mailbox.length > 0 && !mailboxIsValid}
                  disabled={isConfiguring}
                  required
                />

                <span className="break-all text-sm text-muted-foreground sm:shrink-0">
                  @{normalizedDomain || "yourdomain.com"}
                </span>
              </div>

              {mailbox.length > 0 && !mailboxIsValid && (
                <p className="text-xs text-destructive">
                  Enter a valid alias using letters, numbers, dots, underscores,
                  plus signs, or hyphens. It cannot start or end with
                  punctuation.
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
                aria-invalid={forwardTo.length > 0 && !emailIsValid}
                disabled={isConfiguring}
                required
              />

              <p className="text-xs leading-relaxed text-muted-foreground">
                Incoming messages to{" "}
                <span className="break-all font-medium text-foreground">
                  {normalizedMailbox || "your-alias"}@
                  {normalizedDomain || "yourdomain.com"}
                </span>{" "}
                will be forwarded to this inbox.
              </p>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border bg-muted/30 p-3">
              <Inbox className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <p className="text-xs leading-relaxed text-muted-foreground">
                Email forwarding is not a full mailbox and does not provide
                outgoing email. Compatible DNS and MX records are required for
                incoming messages to reach your destination.
              </p>
            </div>

            {mutationError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p className="break-words">
                  {mutationError instanceof Error
                    ? mutationError.message
                    : "We couldn't configure email forwarding. Please try again."}
                </p>
              </div>
            )}

            {isConfigureSuccess && (
              <div
                role="status"
                className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <p>
                  Forwarding rule saved successfully. Verify your DNS settings
                  if incoming messages do not arrive.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={!canSubmit}>
                {isConfiguring ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Send className="mr-2 size-4" />
                )}

                {isConfiguring ? "Saving rule..." : "Save forwarding rule"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Card>
  );
}
