"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDomainModal } from "../hooks/useDomainModal";
import { DomainContact, DomainSuggestion } from "../types/domain";
import { Search, X, Check, AlertCircle, Loader2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DomainModalProps {
  onClose: () => void;
  contact: DomainContact;
}

export function DomainModal({ onClose, contact }: DomainModalProps) {
  const {
    keyword,
    setKeyword,
    suggestions,
    loading,
    buying,
    error,
    clearError,
    searchDomain,
    buyDomain,
  } = useDomainModal();

  const handleBuy = async (domainSuggestion: DomainSuggestion) => {
    const result = await buyDomain(domainSuggestion.domain, contact);
    if (result.success) {
      alert(`🎉 Domain ${domainSuggestion.domain} registered successfully!`);
    } else {
      alert(`❌ Failed: ${result.error?.message || "Unknown error"}`);
    }
  };

  const handleSearch = () => {
    clearError();
    searchDomain();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Sort suggestions by price (lowest first) and availability
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (a.available && !b.available) return -1;
    if (!a.available && b.available) return 1;
    return a.price - b.price;
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Find a Domain</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Section */}
        <div className="p-4 space-y-3 shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter domain name..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  clearError();
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="pl-9"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading || !keyword.trim()}
              size="sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Results Section - This is the scrollable area */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="p-3 bg-muted/50 shrink-0">
            <h3 className="text-sm font-medium">
              Domains {suggestions.length > 0 && `(${suggestions.length})`}
            </h3>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {suggestions.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground h-full flex items-center justify-center">
                <div>
                  <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {keyword
                      ? "No domains found"
                      : "Search for domains to get started"}
                  </p>
                </div>
              </div>
            )}

            {sortedSuggestions.map((item) => (
              <Card
                key={item.domain}
                className={
                  item.available
                    ? "border-green-200 hover:border-green-300 transition-colors"
                    : "border-muted opacity-70"
                }
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            !item.available ? "text-muted-foreground" : ""
                          }`}
                        >
                          {item.domain}
                        </span>
                        {item.available ? (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-300 text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Available
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground text-xs"
                          >
                            Taken
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${item.price}/{item.currency}/year
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuy(item)}
                      disabled={buying === item.domain || !item.available}
                      size="sm"
                      variant={item.available ? "default" : "outline"}
                    >
                      {buying === item.domain ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : item.available ? (
                        "Buy"
                      ) : (
                        "Taken"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/30 shrink-0">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
