"use client";

import { Website } from "../api/getPendingWebsites";
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

interface PendingWebsitesTableProps {
  websites: Website[];
  refresh: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PendingWebsitesTable = ({
  websites,
  refresh,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}: PendingWebsitesTableProps) => {
  const { mutate, isPending, variables } = useApprovePayment(refresh);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
        <CardTitle>Pending Approvals</CardTitle>

        <div className="relative w-full max-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by User ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
                <TableHead>Owner ID</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {websites.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? `No results found for "${searchQuery}"`
                      : "No pending websites found 🎉"}
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
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {site.userId}
                      </TableCell>
                      <TableCell>
                        {new Date(site.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {site.deploymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
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
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
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
