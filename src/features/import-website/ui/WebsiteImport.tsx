"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowUpFromLine,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileArchive,
  FileCode2,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import { importWebsite } from "../api/importWebsite";
import { usePreviewImportedWebsite } from "../hooks/usePreviewImportedWebsite";
import { useWebsiteImports } from "../hooks/useWebsiteImports";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(date));
}

function ImportError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="break-words">{message}</p>
    </div>
  );
}

function ImportedWebsiteCard({
  website,
}: {
  website: {
    id: string;
    title: string;
    originalFileName: string;
    entryPoint: string;
    status: "uploaded";
    fileCount: number;
    totalSize: number;
    createdAt: string;
  };
}) {
  const previewQuery = usePreviewImportedWebsite(website.id);
  const router = useRouter();

  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileCode2 className="size-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="break-words font-medium">{website.title}</h3>

          <p className="break-all text-sm text-muted-foreground">
            {website.originalFileName}
          </p>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{website.fileCount} files</span>
            <span>{formatFileSize(website.totalSize)}</span>
            <span>Imported {formatDate(website.createdAt)}</span>
          </div>

          {previewQuery.data?.previewUrl && (
            <a
              href={previewQuery.data.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 break-all pt-2 text-sm text-primary underline-offset-4 hover:underline"
            >
              <ExternalLink className="size-3.5 shrink-0" />
              Open website preview
            </a>
          )}

          {previewQuery.isError && (
            <div className="pt-2">
              <p className="text-sm text-destructive">
                Could not load the preview link.
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto px-0"
                onClick={() => previewQuery.refetch()}
              >
                <RefreshCw className="mr-1 size-3.5" />
                Retry preview
              </Button>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={previewQuery.isFetching}
            onClick={() => previewQuery.refetch()}
          >
            {previewQuery.isFetching ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Eye className="mr-2 size-4" />
            )}
            {previewQuery.data ? "Refresh link" : "Get preview"}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => router.push(`/domain/${website.id}`)}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WebsiteImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importId, setImportId] = useState<string>();
  const [validationError, setValidationError] = useState("");

  const importsQuery = useWebsiteImports();
  const previewQuery = usePreviewImportedWebsite(importId);

  const importMutation = useMutation({
    mutationFn: importWebsite,

    onSuccess: async (result) => {
      setImportId(result.importId);
      setSelectedFile(null);
      setValidationError("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await queryClient.invalidateQueries({
        queryKey: ["website-imports", "list"],
      });
    },

    onError: (error) => {
      setValidationError(
        error instanceof Error
          ? error.message
          : "Failed to import website. Please try again.",
      );
    },
  });

  function handleFileChange(file?: File) {
    setValidationError("");
    setSelectedFile(null);
    setImportId(undefined);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setValidationError("Please select a ZIP file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError("The ZIP file must be 20 MB or smaller.");
      return;
    }

    if (file.size === 0) {
      setValidationError("The selected file is empty.");
      return;
    }

    setSelectedFile(file);
  }

  function handleImport() {
    if (!selectedFile || importMutation.isPending) return;

    setImportId(undefined);
    setValidationError("");
    importMutation.mutate(selectedFile);
  }

  function resetImport() {
    setSelectedFile(null);
    setImportId(undefined);
    setValidationError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const isUploading = importMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Page heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Imported websites</h1>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Import a static website from a ZIP archive, preview it, and return to
          your previously imported websites whenever you need them.
        </p>
      </div>

      {/* Upload section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            Import a new website
          </CardTitle>

          <CardDescription>
            Upload a ZIP containing your HTML, CSS, JavaScript, images, and
            other static assets.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <label
            htmlFor="website-zip"
            className={[
              "flex min-h-44 cursor-pointer flex-col items-center justify-center",
              "rounded-xl border-2 border-dashed p-6 text-center transition-colors",
              "hover:border-primary/60 hover:bg-muted/40",
              selectedFile ? "border-primary/50 bg-muted/30" : "border-border",
              isUploading ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
          >
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileArchive className="size-6" />
            </span>

            <span className="font-medium">
              {selectedFile
                ? "ZIP file selected"
                : "Choose a ZIP file to upload"}
            </span>

            <span className="mt-2 text-sm text-muted-foreground">
              {selectedFile ? selectedFile.name : "Click to browse your files"}
            </span>

            <span className="mt-1 text-xs text-muted-foreground">
              Maximum file size: 20 MB
            </span>

            <Input
              ref={fileInputRef}
              id="website-zip"
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              className="sr-only"
              disabled={isUploading}
              onChange={(event) => handleFileChange(event.target.files?.[0])}
            />
          </label>

          {selectedFile && (
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <FileArchive className="size-7 shrink-0 text-muted-foreground" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove selected file"
                disabled={isUploading}
                onClick={() => handleFileChange(undefined)}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}

          {validationError && <ImportError message={validationError} />}

          {isUploading && (
            <div className="space-y-2" role="status">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Importing your website...</span>
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
              </div>

              <Progress value={undefined} />

              <p className="text-xs text-muted-foreground">
                Validating the archive, extracting files, and uploading your
                website. This may take a moment.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={!selectedFile || isUploading}
              onClick={handleImport}
            >
              {isUploading ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="mr-2 size-4" />
                  Import website
                </>
              )}
            </Button>

            {(selectedFile || importId) && !isUploading && (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={resetImport}
              >
                Start over
              </Button>
            )}
          </div>

          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" />
            <p>
              Your archive is validated before upload. The website must be a
              static site with an{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                index.html
              </code>{" "}
              at its root.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview for the website just imported */}
      {importId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" />
              Website imported successfully
            </CardTitle>
            <CardDescription>
              Your website has been uploaded. You can open its preview below.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {previewQuery.isPending && (
              <div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                role="status"
              >
                <LoaderCircle className="size-4 animate-spin" />
                Preparing your preview...
              </div>
            )}

            {previewQuery.isError && (
              <ImportError
                message={
                  previewQuery.error instanceof Error
                    ? previewQuery.error.message
                    : "Could not prepare the preview."
                }
              />
            )}

            {previewQuery.data?.previewUrl && (
              <a
                href={previewQuery.data.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-4" />
                Open website preview
              </a>
            )}

            <div className="flex flex-wrap gap-2">
              {previewQuery.isError && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => previewQuery.refetch()}
                >
                  <RefreshCw className="mr-2 size-4" />
                  Retry preview
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["website-imports", "list"],
                  })
                }
              >
                View updated import list
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Previously imported websites */}
      <section
        className="space-y-4"
        aria-labelledby="imported-websites-heading"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2
              id="imported-websites-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Your imported websites
            </h2>
            <p className="text-sm text-muted-foreground">
              Access and preview websites you uploaded previously.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={importsQuery.isFetching}
            onClick={() => importsQuery.refetch()}
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                importsQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh list
          </Button>
        </div>

        {importsQuery.isPending && (
          <div className="flex items-center justify-center gap-2 rounded-xl border p-8 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Loading your imported websites...
          </div>
        )}

        {importsQuery.isError && (
          <div className="space-y-3 rounded-xl border p-5">
            <ImportError
              message={
                importsQuery.error instanceof Error
                  ? importsQuery.error.message
                  : "Failed to fetch your imported websites."
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => importsQuery.refetch()}
            >
              <RefreshCw className="mr-2 size-4" />
              Try again
            </Button>
          </div>
        )}

        {importsQuery.isSuccess && importsQuery.data.items.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
              <FileCode2 className="size-6 text-muted-foreground" />
            </div>

            <h3 className="font-medium">No imported websites yet</h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Upload a ZIP archive above. Your imported website will appear here
              so you can preview it again later.
            </p>
          </div>
        )}

        {importsQuery.isSuccess && importsQuery.data.items.length > 0 && (
          <div className="space-y-3">
            {importsQuery.data.items.map((website) => (
              <ImportedWebsiteCard key={website.id} website={website} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
