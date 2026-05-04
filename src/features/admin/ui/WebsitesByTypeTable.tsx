"use client";

import { useState } from "react";
import { Mail, Phone, User, Globe2, FileText } from "lucide-react";

import { WebsiteByType } from "../api/getWebsitesByType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCountryName } from "@/lib/countries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebsitesByTypeTableProps {
  websites: WebsiteByType[];
  title: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  status: string;
}

export const WebsitesByTypeTable = ({
  websites,
  title,
  currentPage,
  totalPages,
  totalCount,
  status,
}: WebsitesByTypeTableProps) => {
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteByType | null>(
    null,
  );
  const [selectedDescription, setSelectedDescription] =
    useState<WebsiteByType | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    params.set("page", "1"); // reset pagination

    router.push(`${pathname}?${params.toString()}`);
  };

  const updateQuery = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
        <CardTitle>{title} Websites</CardTitle>

        <div className="flex items-center gap-3">
          {/* 🔽 Filter */}
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>

          {/* Total */}
          <div className="text-sm text-muted-foreground">
            Total websites:{" "}
            <span className="font-semibold text-foreground">{totalCount}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-15">#</TableHead>
                <TableHead>Website Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {websites.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                websites.map((site, index) => (
                  <TableRow key={`${site.title}-${index}`}>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {site.title || "Untitled Project"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDescription(site)}
                        className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <FileText className="size-4" />
                        <span className="text-xs">View Description</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {site.status
                        ? site.status.charAt(0).toUpperCase() +
                          site.status.slice(1)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe2 className="size-4 text-muted-foreground" />
                        {site.country ? getCountryName(site.country) : "-"}{" "}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWebsite(site)}
                        className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <User className="size-4" />
                        <span className="text-xs">View Info</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages || 1}</span>
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuery(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuery(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog
        open={!!selectedWebsite}
        onOpenChange={() => setSelectedWebsite(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Website Contact Info</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-1 border-b pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Website
              </span>
              <span className="text-sm">
                {selectedWebsite?.title || "Untitled Project"}
              </span>
            </div>

            <div className="flex items-center gap-3 border-b pb-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Email
                </span>
                <span className="text-sm tabular-nums font-medium">
                  {selectedWebsite?.email || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b pb-2">
              <Phone className="h-4 w-4 text-green-500" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Phone
                </span>
                <span className="text-sm">
                  {selectedWebsite?.phone || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setSelectedWebsite(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedDescription}
        onOpenChange={() => setSelectedDescription(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Website Description</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                Website
              </p>
              <p className="text-sm font-medium">
                {selectedDescription?.title || "Untitled Project"}
              </p>
            </div>

            <div className="rounded-md border bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">
                {selectedDescription?.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setSelectedDescription(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
