"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  keyword: string;
  setKeyword: (val: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function SearchInput({
  keyword,
  setKeyword,
  onSearch,
  loading,
}: SearchInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Enter domain name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="pl-9"
        />
      </div>
      <Button
        onClick={onSearch}
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
  );
}
