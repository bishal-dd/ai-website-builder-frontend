"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe2, ArrowRightLeft, ExternalLink } from "lucide-react";
import { Domain } from "../types/domain";

interface DomainListProps {
  domains: Domain[];
  onTransfer: (domain: Domain) => void;
}

export function DomainList({ domains, onTransfer }: DomainListProps) {
  const getStatusColor = (status: Domain["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "transferred":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="grid gap-4">
      {domains.map((domain) => (
        <Card
          key={domain.id}
          className="hover:border-primary/50 transition-colors"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe2 className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{domain.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span>Registrar: {domain.registrar}</span>
                    {domain.connectedWebsite && (
                      <>
                        <span>•</span>
                        <span>Connected to: {domain.connectedWebsite}</span>
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={getStatusColor(domain.status)}
                className="capitalize"
              >
                {domain.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Expiry Date</p>
                  <p className="font-medium">{domain.expiryDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Auto Renew</p>
                  <p className="font-medium">
                    {domain.autoRenew ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 size-4" />
                  Manage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTransfer(domain)}
                >
                  <ArrowRightLeft className="mr-2 size-4" />
                  Transfer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
