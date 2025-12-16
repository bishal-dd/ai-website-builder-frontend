"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainSuggestion } from "../types/domain";

interface DomainCardProps {
  domain: DomainSuggestion;
  onSelect: (domain: DomainSuggestion) => void;
  disabled?: boolean;
}

export function DomainCard({ domain, onSelect, disabled }: DomainCardProps) {
  return (
    <Card className="border-green-200 hover:border-green-300 transition-colors">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{domain.domain}</span>
            {domain.available && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-300 text-xs"
              >
                <Check className="w-3 h-3 mr-1" /> Available
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {domain.currency} {domain.price}/year
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => onSelect(domain)}
          disabled={disabled || !domain.available}
        >
          Select
        </Button>
      </CardContent>
    </Card>
  );
}
