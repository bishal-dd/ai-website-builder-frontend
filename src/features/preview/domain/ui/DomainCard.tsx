"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DomainCardProps {
  domain: any; // DomainSuggestion
  onSelect: (domain: any) => void;
}

export function DomainCard({ domain, onSelect }: DomainCardProps) {
  return (
    <Card className="border-green-200 hover:border-green-300 transition-colors">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{domain.domain}</span>
            <Badge
              variant="outline"
              className="text-green-600 border-green-300 text-xs"
            >
              <Check className="w-3 h-3 mr-1" /> Available
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {domain.price}/ {domain.currency}/year
          </div>
        </div>
        <Button size="sm" onClick={() => onSelect(domain)}>
          Select
        </Button>
      </CardContent>
    </Card>
  );
}
