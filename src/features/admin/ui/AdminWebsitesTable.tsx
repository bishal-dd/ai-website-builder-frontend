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
import { useApprovePayment } from "@/features/admin/hooks/useApprovePayment";
import { useDebouncedCallback } from "../hooks/useDebounce";
import { PaymentInput } from "../api/approvePayment";
import { toast } from "sonner";
import { usePayInstallment } from "../hooks/usePayInstallment";

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

  const [selectedUser, setSelectedUser] = useState<Website | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Website | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Website | null>(null);

  const { mutate: approvePaymentMutate } = useApprovePayment(refresh);
  const currentSearch = searchParams.get("websiteId") || "";

  const { mutate: payInstallmentMutate, isPending: isPayingInstallment } =
    usePayInstallment(() => {
      refresh();
      toast.success("Installment paid successfully");
    });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<Partial<PaymentInput>>({});
  const [currentSite, setCurrentSite] = useState<Website | null>(null);

  const totalAmount = Number(selectedPayment?.totalAmount || 0);
  const paidAmount = Number(selectedPayment?.paidAmount || 0);
  const remainingAmount = Math.max(0, totalAmount - paidAmount);

  const isInstallment = selectedPayment?.paymentType === "installments";

  const isFullyPaid = paidAmount >= totalAmount || remainingAmount === 0;

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

  const buildPaymentPayload = (): PaymentInput | null => {
    if (!currentSite || !paymentData) return null;

    const total = Math.round(paymentData.totalAmount || 0);
    let paid = Math.round(paymentData.paidAmount || 0);
    let remaining = total - paid;

    if (paymentData.paymentType === "full") {
      paid = total;
      remaining = 0;
    }

    return {
      websiteId: currentSite.id,
      totalAmount: total,
      paidAmount: paid,
      totalRemainingAmount: remaining,
      paymentType: paymentData.paymentType || "full",
      installmentNumber: 4,
      paymentDate:
        paymentData.paymentDate || new Date().toISOString().split("T")[0],
    };
  };

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
                {status === "approved" && <TableHead>Payment</TableHead>}
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
                  const total =
                    Number(site.domainPrice || 0) +
                    Number(site.hostingPrice || 0) +
                    Number(site.websitePrice || 0);

                  return (
                    <TableRow key={site.id}>
                      {/* Serial */}
                      <TableCell>{serialNumber}</TableCell>

                      {/* User Name */}
                      <TableCell>
                        <span className="text-sm font-medium">
                          {site.userName || "User"}
                        </span>
                      </TableCell>

                      {/* Contact */}
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

                      {/* Website Title */}
                      <TableCell className="font-medium">
                        {site.title}
                      </TableCell>

                      {/* Total Price */}
                      <TableCell>
                        <button
                          onClick={() => setSelectedPrice(site)}
                          className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                        >
                          {formatPrice(total)}
                          <Info className="h-3 w-3" />
                        </button>
                      </TableCell>

                      {/* Payment / Status */}
                      <TableCell>
                        {status === "approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(site)}
                            className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-700"
                          >
                            View Payment
                          </Button>
                        )}
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
                            onClick={() => {
                              setCurrentSite(site);
                              setPaymentData({
                                websiteId: site.id,
                                totalAmount:
                                  Number(site.websitePrice) +
                                  Number(site.hostingPrice) +
                                  Number(site.domainPrice),
                                paymentType: "full",
                                paidAmount: Number(site.domainPrice || 0),
                                paymentDate: new Date()
                                  .toISOString()
                                  .split("T")[0],
                              });
                              setPaymentModalOpen(true);
                            }}
                          >
                            Approve
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

      <Dialog
        open={paymentModalOpen}
        onOpenChange={() => setPaymentModalOpen(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Payment for {currentSite?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div>
              <label className="text-xs font-semibold">Payment Type</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={paymentData.paymentType}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    paymentType: e.target.value as "full" | "installments",
                  })
                }
              >
                <option value="full">Full</option>
                <option value="installments">Installments</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">Payment Date</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1"
                value={paymentData.paymentDate}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    paymentDate: e.target.value,
                  })
                }
              />
            </div>
            {paymentData.paymentType === "installments" && (
              <>
                <div>
                  <label className="text-xs font-semibold">Paid Amount</label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={
                      paymentData.paidAmount === 0 ? "" : paymentData.paidAmount
                    }
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paidAmount:
                          e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}

            {paymentData.paymentType === "installments" && (
              <div>
                <label className="text-xs font-semibold">
                  Total Remaining Amount
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 bg-gray-100"
                  value={
                    (paymentData.totalAmount || 0) -
                    (paymentData.paidAmount || 0)
                  }
                  disabled
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold">Total Amount</label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                value={
                  paymentData.totalAmount === 0 ? "" : paymentData.totalAmount
                }
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    totalAmount:
                      e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                const payload = buildPaymentPayload();
                if (!payload || !currentSite) {
                  toast.error("Invalid payment data!");
                  return;
                }

                approvePaymentMutate(payload, {
                  onSuccess: () => {
                    setPaymentModalOpen(false);
                    toast.success(`Payment approved for ${currentSite.title}`);
                  },
                  onError: (err: unknown) => {
                    console.error(err);

                    const message =
                      err instanceof Error
                        ? err.message
                        : "Something went wrong while approving payment";

                    toast.error(message);
                  },
                });
              }}
            >
              Approve Payment
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
          {/* Header */}
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
            {/* Payment Type + Status */}
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

            {/* Amount Summary */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Paid Amount
                  </p>
                  <p className="text-xl font-semibold mt-1">
                    Nu. {formatPrice(paidAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="text-xl font-semibold mt-1">
                    Nu. {formatPrice(totalAmount)}
                  </p>
                </div>
              </div>

              {/* Remaining Balance */}
              {isInstallment && remainingAmount > 0 && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Remaining Balance
                  </span>
                  <span className="text-sm font-semibold">
                    Nu. {formatPrice(remainingAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Next Installment */}
            {isInstallment && !isFullyPaid && (
              <div className="rounded-xl border p-4 space-y-4">
                <p className="text-sm font-medium">Next Installment</p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Amount
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Nu. {formatPrice(selectedPayment?.installmentAmount || 0)}
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

            {/* Completed Payment Message */}
            {isFullyPaid && isInstallment && (
              <div className="rounded-xl border p-4 text-sm font-medium text-center">
                All installments have been paid
              </div>
            )}

            {/* Footer */}
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
