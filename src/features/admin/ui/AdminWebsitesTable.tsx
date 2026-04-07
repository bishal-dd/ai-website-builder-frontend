"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useApprovePayment } from "@/features/admin/hooks/useApprovePayment";
import { useDebouncedCallback } from "../hooks/useDebounce";

interface AdminWebsitesTableProps {
  websites: Website[];
  refresh: () => void;
  currentPage: number;
  totalPages: number;
  status: string;
  totalCount: number;
}

export const AdminWebsitesTable = ({
  websites,
  refresh,
  currentPage,
  totalPages,
  status,
  totalCount,
}: AdminWebsitesTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modal States
  const [selectedUser, setSelectedUser] = useState<Website | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Website | null>(null);

  const { mutate, isPending, variables } = useApprovePayment(refresh);
  const currentSearch = searchParams.get("websiteId") || "";

  // Safe formatting helper
  // Safe formatting helper
  const formatPrice = (val: string | number | null | undefined) => {
    const num = Number(val) || 0;
    return num.toFixed(2);
  };

  const updateQuery = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "websiteId") params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
        <CardTitle className="capitalize">
          {status === "pending" ? "Pending pendings" : `${status} Websites`}
        </CardTitle>

        <div className="text-sm text-muted-foreground">
          Total {status} websites:{" "}
          <span className="font-semibold text-foreground">{totalCount}</span>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Website ID..."
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
                <TableCell>#</TableCell>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Website Title</TableHead>
                <TableHead>Total Price</TableHead>
                {status === "pending" && <TableHead>Status</TableHead>}
                {status === "pending" && (
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
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                websites.map((site, index) => {
                  const serialNumber = (currentPage - 1) * 10 + index + 1;
                  const isApproving = isPending && variables === site.id;

                  const total =
                    Number(site.domainPrice || 0) +
                    Number(site.hostingPrice || 0) +
                    Number(site.websitePrice || 0);

                  return (
                    <TableRow key={site.id}>
                      <TableCell>{serialNumber}</TableCell>

                      {/* USER COLUMN - Plain Text */}
                      <TableCell>
                        <span className="text-sm font-medium">
                          {site.userName || "User"}
                        </span>
                      </TableCell>

                      {/* CONTACT COLUMN - New Button */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(site)}
                          className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <User className="size-4" />
                          <span className="text-xs">View Info</span>
                        </Button>
                      </TableCell>

                      <TableCell className="font-medium">
                        {site.title}
                      </TableCell>

                      <TableCell>
                        <button
                          onClick={() => setSelectedPrice(site)}
                          className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                        >
                          {formatPrice(total)}
                          <Info className="h-3 w-3" />
                        </button>
                      </TableCell>

                      <TableCell>
                        {status === "pending" && (
                          <Badge variant="secondary" className="capitalize">
                            {site.deploymentStatus}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {status === "pending" && (
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

        {/* Pagination Controls */}
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
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuery("page", (currentPage + 1).toString())}
              disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* --- PRICE BREAKDOWN MODAL --- */}
      <Dialog
        open={!!selectedPrice}
        onOpenChange={() => setSelectedPrice(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Price Breakdown</DialogTitle>
            <DialogDescription>
              Costs for {selectedPrice?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">Domain Registration</span>
              <span className="font-mono">
                {formatPrice(selectedPrice?.domainPrice)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">Hosting Plan</span>
              <span className="font-mono">
                {formatPrice(selectedPrice?.hostingPrice)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">AI Generation Fee</span>
              <span className="font-mono">
                {formatPrice(selectedPrice?.websitePrice)}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-green-600">
                {formatPrice(
                  Number(selectedPrice?.domainPrice || 0) +
                    Number(selectedPrice?.hostingPrice || 0) +
                    Number(selectedPrice?.websitePrice || 0),
                )}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- USER CONTACT MODAL --- */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Contact Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-1 border-b pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Name
              </span>
              <span className="text-sm">{selectedUser?.userName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 border-b pb-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Email
                </span>
                <span className="text-sm font-mono">
                  {selectedUser?.userEmail || "N/A"}
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
                  {selectedUser?.userPhone || "Not provided"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
