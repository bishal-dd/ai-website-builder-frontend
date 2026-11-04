"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useImportWebsite } from "../hooks/useImportWebsite";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function ImportWebsiteForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { importWebsite, result, isImporting, error, reset } =
    useImportWebsite();

  function validateFile(file: File): boolean {
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setValidationError("Please select a ZIP file.");
      return false;
    }

    if (file.size === 0) {
      setValidationError("The selected ZIP file is empty.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError("The ZIP file must be 20 MB or smaller.");
      return false;
    }

    setValidationError(null);
    return true;
  }

  function handleFile(file?: File) {
    if (!file) return;

    reset();
    setSelectedFile(null);

    if (validateFile(file)) {
      setSelectedFile(file);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  }

  async function handleUpload() {
    if (!selectedFile || isImporting) return;

    try {
      await importWebsite(selectedFile);
    } catch {
      // The hook exposes the error for display below.
    }
  }

  function handleReset() {
    reset();
    setSelectedFile(null);
    setValidationError(null);
  }

  const displayedError = validationError ?? error?.message;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Import website
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload a static website ZIP file to validate and prepare it for
          hosting on Sencill.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload your website</CardTitle>
          <CardDescription>
            Upload a ZIP containing HTML, CSS, JavaScript, and other static
            assets. Your archive must contain an index.html file at its root.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {!result && (
            <>
              <div
                role="button"
                tabIndex={0}
                aria-label="Choose a website ZIP file"
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="size-6 text-primary" />
                </div>

                <p className="font-medium">
                  Drop your ZIP file here or{" "}
                  <span className="text-primary">browse files</span>
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  ZIP format only · Maximum size 20 MB
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  accept=".zip,application/zip"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <FileArchive className="size-8 shrink-0 text-primary" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove selected file"
                    disabled={isImporting}
                    onClick={() => {
                      setSelectedFile(null);
                      setValidationError(null);
                      reset();
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}

              {displayedError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span className="break-words">{displayedError}</span>
                </div>
              )}

              <Button
                type="button"
                className="w-full"
                disabled={!selectedFile || isImporting}
                onClick={handleUpload}
              >
                {isImporting ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Uploading and validating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 size-4" />
                    Import website
                  </>
                )}
              </Button>
            </>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-lg border border-green-600/20 bg-green-600/5 p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />

                <div className="space-y-1">
                  <p className="font-medium">Website validated successfully</p>
                  <p className="text-sm text-muted-foreground">
                    Your ZIP was uploaded and extracted. Hosting and deployment
                    have not been completed yet.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Files found</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {result.fileCount}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">
                    Extracted size
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {(result.totalSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{result.status}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Entry point</span>
                  <span className="font-medium">{result.entryPoint}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Import ID</span>
                  <span className="break-all text-right font-mono text-xs">
                    {result.importId}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                Import another website
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
