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
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useDebouncedCallback } from "../hooks/useDebounce";
import { toast } from "sonner";
import { usePayInstallment } from "../hooks/usePayInstallment";

interface ApprovedWebsitesTableProps {
  websites: Website[];
  refresh: () => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const ApprovedWebsitesTable = ({
  websites,
  refresh,
  currentPage,
  totalPages,
  totalCount,
}: ApprovedWebsitesTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedUser, setSelectedUser] = useState<Website | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Website | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Website | null>(null);

  const currentSearch = searchParams.get("websiteId") || "";

  const { mutate: payInstallmentMutate, isPending: isPayingInstallment } =
    usePayInstallment(() => {
      refresh();
      toast.success("Installment paid successfully");
    });

  const totalAmount = Number(selectedPayment?.totalAmount || 0);
  const paidAmount = Number(selectedPayment?.paidAmount || 0);
  const remainingAmount = Math.max(0, totalAmount - paidAmount);
  const isInstallment = selectedPayment?.paymentType === "installments";
  const isFullyPaid = paidAmount >= totalAmount || remainingAmount === 0;

  const roundDown = (val: unknown) => Math.floor(Number(val) || 0);

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
        <CardTitle>Approved Websites</CardTitle>

        <div className="text-sm text-muted-foreground">
          Total approved:{" "}
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
                <TableHead className="w-15">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Website Title</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead className="text-right">Payment</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {websites.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No approved websites found.
                  </TableCell>
                </TableRow>
              ) : (
                websites.map((site, index) => {
                  const serialNumber = (currentPage - 1) * 10 + index + 1;
                  const total =
                    Number(site.domainPrice || 0) +
                    Number(site.hostingPrice || 0) +
                    Number(site.websitePrice || 0);

                  return (
                    <TableRow key={site.id}>
                      <TableCell>{serialNumber}</TableCell>

                      <TableCell>
                        <span className="text-sm font-medium">
                          {site.userName || "User"}
                        </span>
                      </TableCell>

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
                          Nu. {roundDown(total)}
                          <Info className="h-3 w-3" />
                        </button>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayment(site)}
                          className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View Payment
                        </Button>
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
              <span className="tabular-nums font-medium">
                {roundDown(selectedPrice?.domainPrice)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">Hosting Plan</span>
              <span className="tabular-nums font-medium">
                {roundDown(selectedPrice?.hostingPrice)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 text-sm">
              <span className="text-muted-foreground">AI Generation Fee</span>
              <span className="tabular-nums font-medium">
                {roundDown(selectedPrice?.websitePrice)}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-green-600">
                Nu.{" "}
                {roundDown(
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
                <span className="text-sm tabular-nums font-medium">
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

      {/* --- VIEW PAYMENT DETAILS MODAL --- */}
      <Dialog
        open={!!selectedPayment}
        onOpenChange={() => setSelectedPayment(null)}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border shadow-xl">
          <div className="border-b px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Payment Details
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Transaction records for{" "}
                <span className="font-medium text-foreground">
                  {selectedPayment?.title}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Payment Type
                </p>
                <p className="text-sm font-medium mt-1">
                  {isInstallment ? "Installments" : "Full Payment"}
                </p>
              </div>

              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs font-medium"
              >
                {isFullyPaid ? "Paid" : "Active"}
              </Badge>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Paid Amount
                  </p>
                  <p className="text-xl font-semibold mt-1">
                    Nu. {roundDown(paidAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="text-xl font-semibold mt-1">
                    Nu. {roundDown(totalAmount)}
                  </p>
                </div>
              </div>

              {isInstallment && remainingAmount > 0 && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Remaining Balance
                  </span>
                  <span className="text-sm font-semibold">
                    Nu. {roundDown(remainingAmount)}
                  </span>
                </div>
              )}
            </div>

            {isInstallment && !isFullyPaid && (
              <div className="rounded-xl border p-4 space-y-4">
                <p className="text-sm font-medium">Next Installment</p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Amount
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Nu. {roundDown(selectedPayment?.installmentAmount || 0)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Due Date
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {selectedPayment?.nextInstallmentDate
                        ? new Date(
                            selectedPayment.nextInstallmentDate,
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isFullyPaid && isInstallment && (
              <div className="rounded-xl border p-4 text-sm font-medium text-center">
                All installments have been paid
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Last Payment Date
              </p>
              <p className="text-sm mt-1">
                {selectedPayment?.paymentDate
                  ? new Date(selectedPayment.paymentDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-muted/20">
            {isInstallment && !isFullyPaid && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isPayingInstallment}
                onClick={() => {
                  if (!selectedPayment) return;

                  payInstallmentMutate(
                    {
                      websiteId: selectedPayment.id,
                      paymentDate: new Date().toISOString().split("T")[0],
                    },
                    {
                      onSuccess: () => {
                        setSelectedPayment(null);
                        refresh();
                      },
                      onError: (err: unknown) => {
                        const message =
                          err instanceof Error
                            ? err.message
                            : "Failed to pay installment";
                        toast.error(message);
                      },
                    },
                  );
                }}
              >
                {isPayingInstallment ? "Processing..." : "Pay Installment"}
              </Button>
            )}

            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setSelectedPayment(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
