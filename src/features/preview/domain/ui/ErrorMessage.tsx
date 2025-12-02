"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
      <AlertCircle className="w-4 h-4" />
      {message}
    </div>
  );
}
