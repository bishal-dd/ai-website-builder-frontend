"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Website } from "../api/getAdminWebsites";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useApprovePayment } from "@/features/admin/hooks/useApprovePayment";
import { useDebouncedCallback } from "../hooks/useDebounce";

interface AdminWebsitesTableProps {
  websites: Website[];
  refresh: () => void;
  currentPage: number;
  totalPages: number;
  status: string;
}

export const AdminWebsitesTable = ({
  websites,
  refresh,
  currentPage,
  totalPages,
  status,
}: AdminWebsitesTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { mutate, isPending, variables } = useApprovePayment(refresh);

  // Get current search value from URL to display in empty state or input
  const currentSearch = searchParams.get("websiteId") || "";

  // 1. Unified function to update URL params (Stateless)
  const updateQuery = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 whenever search changes
    if (key === "websiteId") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
        <CardTitle className="capitalize">
          {status === "approval"
            ? "Pending Approvals"
            : status === "approved"
              ? "Approved Websites"
              : "Rejected Websites"}
        </CardTitle>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Website ID..."
            // Senior Tip: Use defaultValue for debounced URL inputs
            // to prevent the input from flickering/losing focus
            defaultValue={currentSearch}
            onChange={(e) => updateQuery("websiteId", e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website ID</TableHead>
                <TableHead>Website Title</TableHead>
                <TableHead>Domain Price</TableHead>
                <TableHead>Hosting Price</TableHead>
                <TableHead>Website Generation Price</TableHead>
                {status === "approval" && <TableHead>Status</TableHead>}
                {status === "approval" && (
                  <TableHead className="text-right">Action</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {websites.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {currentSearch
                      ? `No results found for "${currentSearch}"`
                      : status === "approval"
                        ? "No pending websites found 🎉"
                        : status === "approved"
                          ? "No approved websites found 🎉"
                          : "No rejected websites found 🎉"}
                  </TableCell>
                </TableRow>
              ) : (
                websites.map((site) => {
                  const isApproving = isPending && variables === site.id;
                  return (
                    <TableRow key={site.id}>
                      <TableCell className="font-mono text-xs">
                        {site.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {site.title}
                      </TableCell>
                      <TableCell>{site.domainPrice}</TableCell>
                      <TableCell>{site.hostingPrice}</TableCell>
                      <TableCell>{site.websitePrice}</TableCell>

                      <TableCell>
                        {status === "approval" && (
                          <Badge variant="secondary" className="capitalize">
                            {site.deploymentStatus}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {status === "approval" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isApproving}
                            onClick={() => mutate(site.id)}
                          >
                            {isApproving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Approve"
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- Pagination Controls --- */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages || 1}</span>
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuery("page", (currentPage - 1).toString())}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuery("page", (currentPage + 1).toString())}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
