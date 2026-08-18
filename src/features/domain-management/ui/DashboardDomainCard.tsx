"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

import { DomainSuggestion } from "@/features/preview/domain/types/domain";

interface DashboardDomainCardProps {
  domain: DomainSuggestion;
  onBuyNow: (domain: DomainSuggestion) => void;
  onSaveForDeployment: (domain: DomainSuggestion) => void;
  disabled?: boolean;
}

export function DashboardDomainCard({
  domain,
  onBuyNow,
  onSaveForDeployment,
  disabled = false,
}: DashboardDomainCardProps) {
  return (
    <Card className="border-green-200 transition-colors hover:border-green-300">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{domain.domain}</span>

            {domain.available && (
              <Badge
                variant="outline"
                className="shrink-0 border-green-300 text-xs text-green-600"
              >
                <Check className="mr-1 size-3" />
                Available
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {domain.currency} {domain.price}/year
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSaveForDeployment(domain)}
            disabled={disabled || !domain.available}
          >
            Save for deployment
          </Button>

          <Button
            size="sm"
            onClick={() => onBuyNow(domain)}
            disabled={disabled || !domain.available}
          >
            Buy now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
