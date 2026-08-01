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
  Eye,
} from "lucide-react";
import { useApprovePayment } from "@/features/admin/hooks/useApprovePayment";
import { useDebouncedCallback } from "../hooks/useDebounce";
import { PaymentInput } from "../api/approvePayment";
import { toast } from "sonner";

interface PendingWebsitesTableProps {
  websites: Website[];
  refresh: () => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const PendingWebsitesTable = ({
  websites,
  refresh,
  currentPage,
  totalPages,
  totalCount,
}: PendingWebsitesTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedUser, setSelectedUser] = useState<Website | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Website | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<Partial<PaymentInput>>({});
  const [currentSite, setCurrentSite] = useState<Website | null>(null);

  const { mutate: approvePaymentMutate } = useApprovePayment(refresh);
  const currentSearch = searchParams.get("websiteId") || "";

  const roundDown = (val: unknown) => Math.floor(Number(val) || 0);

  const formatCurrency = (amount: number, isInternational?: boolean) => {
    return isInternational
      ? `$ ${roundDown(amount)}`
      : `Nu. ${roundDown(amount)}`;
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

    const total = roundDown(paymentData.totalAmount);
    let paid = roundDown(paymentData.paidAmount);
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
      paymentDate:
        paymentData.paymentDate || new Date().toISOString().split("T")[0],

      ...(paymentData.paymentType === "installments" && {
        installmentNumber: 3,
      }),
    };
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
        <CardTitle>Pending Websites</CardTitle>

        <div className="text-sm text-muted-foreground">
          Total pending:{" "}
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
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
                    roundDown(site.domainPrice) +
                    roundDown(site.hostingPrice) +
                    roundDown(site.websitePrice);
                  return (
                    <TableRow key={site.id}>
                      <TableCell>{serialNumber}</TableCell>
                      <TableCell className="font-medium">
                        {site.userName || "User"}
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
                      <TableCell>{site.title}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => setSelectedPrice(site)}
                          className="tabular-nums flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                        >
                          {formatCurrency(total, site.country !== "BT")}{" "}
                          <Info className="h-3 w-3" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {site.deploymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/preview/${site.id}`)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>

                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setCurrentSite(site);
                              setPaymentData({
                                websiteId: site.id,
                                totalAmount: total,
                                paymentType: "full",
                                paidAmount: roundDown(site.domainPrice),
                                paymentDate: new Date()
                                  .toISOString()
                                  .split("T")[0],
                              });
                              setPaymentModalOpen(true);
                            }}
                          >
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
                {formatCurrency(
                  Number(selectedPrice?.domainPrice || 0) +
                    Number(selectedPrice?.hostingPrice || 0) +
                    Number(selectedPrice?.websitePrice || 0),
                  selectedPrice?.country !== "BT",
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

      {/* --- APPROVAL / PAYMENT CONFIG MODAL --- */}
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
                className="w-full border rounded px-2 py-1 text-sm"
                value={paymentData.paymentType}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    paymentType: e.target.value as "full" | "installments",
                  })
                }
              >
                <option value="full">Full Payment</option>
                <option value="installments">Installments</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold">Payment Date</label>
              <input
                type="date"
                className="w-full border rounded px-2 py-1 text-sm"
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
                  <label className="text-xs font-semibold">
                    Initial Paid Amount (Nu.)
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={
                      paymentData.paidAmount === 0 ? "" : paymentData.paidAmount
                    }
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paidAmount:
                          e.target.value === "" ? 0 : roundDown(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Remaining Amount
                  </label>
                  <div className="w-full border rounded px-2 py-1 text-sm bg-gray-50 tabular-nums font-medium">
                    {formatCurrency(
                      (paymentData.totalAmount || 0) -
                        (paymentData.paidAmount || 0),
                      currentSite?.country !== "BT",
                    )}{" "}
                    {roundDown(
                      (paymentData.totalAmount || 0) -
                        (paymentData.paidAmount || 0),
                    )}
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-semibold">
                Total Amount ({currentSite?.country !== "BT" ? "$" : "Nu."}
                ){" "}
              </label>
              <input
                type="number"
                className="w-full border rounded px-2 py-1 text-sm font-semibold"
                value={
                  paymentData.totalAmount === 0 ? "" : paymentData.totalAmount
                }
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    totalAmount:
                      e.target.value === "" ? 0 : roundDown(e.target.value),
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
                if (!payload || !currentSite) return;
                approvePaymentMutate(payload, {
                  onSuccess: () => {
                    setPaymentModalOpen(false);
                    toast.success(`Approved: ${currentSite.title}`);
                  },
                  onError: (err: unknown) => {
                    const message =
                      err instanceof Error
                        ? err.message
                        : "Error approving payment";

                    toast.error(message);
                  },
                });
              }}
            >
              Confirm Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
