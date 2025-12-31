"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe2,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Domain } from "../types/domain";

interface DomainListProps {
  domains: Domain[];
  onRequestTransfer: (domain: Domain) => void;
}

export function DomainList({ domains, onRequestTransfer }: DomainListProps) {
  const getStatusConfig = (status: Domain["status"]) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          variant: "default" as const,
          icon: CheckCircle2,
        };
      case "transfer_requested":
        return {
          label: "Transfer requested",
          variant: "secondary" as const,
          icon: Clock,
        };
      case "transferred_out":
        return {
          label: "Transferred out",
          variant: "outline" as const,
          icon: ArrowRightLeft,
        };
      case "transfer_failed":
        return {
          label: "Transfer failed",
          variant: "destructive" as const,
          icon: XCircle,
        };
      default:
        return {
          label: status,
          variant: "secondary" as const,
          icon: Clock,
        };
    }
  };

  return (
    <div className="grid gap-4">
      {domains.map((domain) => {
        const transferDisabled =
          domain.status === "transfer_requested" ||
          domain.status === "transferred_out";

        const status = getStatusConfig(domain.status);
        const StatusIcon = status.icon;

        return (
          <Card
            key={domain.id}
            className="group border transition-all hover:shadow-sm hover:border-primary/40"
          >
            <CardHeader className="flex-row items-start justify-between gap-4 pb-4">
              {/* Left: Domain identity */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe2 className="size-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-lg font-semibold">
                      {domain.name}
                    </h3>
                  </div>

                  {domain.connectedWebsite && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Connected to{" "}
                      <span className="font-medium">
                        {domain.connectedWebsite}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Status */}
              <Badge
                variant={status.variant}
                className="flex items-center gap-1.5"
              >
                <StatusIcon className="size-3.5" />
                {status.label}
              </Badge>
            </CardHeader>

            <CardContent className="flex items-center justify-between pt-0">
              {/* Meta strip */}
              <p className="text-xs text-muted-foreground">
                Managed by Sencill AI
              </p>

              {/* Actions */}
              <Button
                variant={transferDisabled ? "outline" : "default"}
                size="sm"
                disabled={transferDisabled}
                onClick={() => onRequestTransfer(domain)}
              >
                <ArrowRightLeft className="mr-2 size-4" />
                {transferDisabled ? "Transfer pending" : "Request transfer"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
