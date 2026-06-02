"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe2,
  KeyRound,
  CheckCircle2,
  Timer,
  ChevronRight,
  Settings2,
} from "lucide-react";
import { Domain } from "../types/domain";
import { cn } from "@/lib/utils";
import { DomainDnsPanel } from "./DomainDnsPanel";

interface DomainListProps {
  domains: Domain[];
  onInitiateTransfer: (domain: Domain) => void;
}

export function DomainList({ domains, onInitiateTransfer }: DomainListProps) {
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      {domains.map((domain) => {
        const isPending = domain.status === "transfer_requested";
        const isExpanded = expandedDomainId === domain.id;

        return (
          <Card
            key={domain.id}
            className={cn(
              "group relative overflow-hidden border-muted/80 transition-all duration-200 hover:shadow-md",
              isPending ? "bg-muted/20" : "bg-card",
            )}
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                      isPending
                        ? "bg-amber-500/10 border-amber-200 text-amber-600"
                        : "bg-primary/5 border-primary/10 text-primary",
                    )}
                  >
                    <Globe2 className="size-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-mono text-lg font-bold tracking-tight text-foreground/90">
                      {domain.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-md px-1.5 py-0 text-[10px] font-bold uppercase tracking-wider",
                          isPending
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {isPending ? (
                          <Timer className="mr-1 size-3" />
                        ) : (
                          <CheckCircle2 className="mr-1 size-3" />
                        )}
                        {isPending
                          ? "Transfer in Progress"
                          : "Active & Secured"}
                      </Badge>

                      <span className="text-[11px] text-muted-foreground">
                        •
                      </span>

                      <span className="text-[11px] text-muted-foreground font-medium">
                        {isPending
                          ? "Waiting for EPP"
                          : "Managed by Sencill AI"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className="h-10 px-5 border-muted-foreground/20"
                    onClick={() =>
                      setExpandedDomainId(isExpanded ? null : domain.id)
                    }
                  >
                    <Settings2 className="mr-2 size-4 opacity-70" />
                    {isExpanded ? "Hide DNS" : "Manage DNS"}
                    <ChevronRight
                      className={cn(
                        "ml-2 size-3 opacity-50 transition-transform",
                        isExpanded && "rotate-90",
                      )}
                    />
                  </Button>

                  {isPending ? (
                    <div className="flex items-center gap-3 px-4 py-2 bg-background/50 rounded-lg border border-dashed border-amber-200">
                      <div className="text-right">
                        <p className="text-xs font-bold text-amber-700">
                          Request Received
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Check your email soon
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="h-10 px-5 border-muted-foreground/20 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 transition-all"
                      onClick={() => onInitiateTransfer(domain)}
                    >
                      <KeyRound className="mr-2 size-4 opacity-70" />
                      Initiate Transfer
                      <ChevronRight className="ml-2 size-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && <DomainDnsPanel domainId={domain.id} />}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
