"use client";

import { useEffect, useState } from "react";
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
  Pencil,
  Plus,
} from "lucide-react";
import { useDebouncedCallback } from "../hooks/useDebounce";
import useWebsitePayment from "../hooks/useWebsitePayment";
import useUpdateWebsitePayment from "../hooks/useUpdateWebsitePayment";
import useCreateWebsitePayment from "../hooks/useCreateWebsitePayment";
import { toast } from "sonner";
import useUpdateDomainPrice from "@/features/preview/domain/hooks/useUpdateDomainPrice";

interface ApprovedWebsitesTableProps {
  websites: Website[];
  refresh: () => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

const emptyPaymentForm = {
  domainPrice: "",
  hostingPrice: "",
  generationPrice: "",
  paymentDate: new Date().toISOString().split("T")[0],
};

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

  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [editValues, setEditValues] = useState({
    domainPrice: "",
    hostingPrice: "",
    generationPrice: "",
    totalAmount: "",
  });

  const { payment: priceBreakdownPayment, isLoading: isPriceBreakdownLoading } =
    useWebsitePayment(selectedPrice?.id);

  const [createValues, setCreateValues] = useState(emptyPaymentForm);

  const currentSearch = searchParams.get("websiteId") || "";

  const {
    payment,
    isLoading: isPaymentLoading,
    refetch: refetchPayment,
  } = useWebsitePayment(selectedPayment?.id);

  const { updatePayment, isUpdating } = useUpdateWebsitePayment(() => {
    toast.success("Payment updated successfully");
    setIsEditingPayment(false);
    refetchPayment();
    refresh();
  });

  const { mutate: updateDomainPrice } = useUpdateDomainPrice();

  const { createPayment, isCreating } = useCreateWebsitePayment(() => {
    toast.success("Payment created successfully");
    setCreateValues(emptyPaymentForm);
    refetchPayment();
    refresh();
  });

  // Sync edit form values whenever the fetched payment changes
  const selectedPaymentDomainPrice = selectedPayment?.domainPrice;
  const hasSelectedPayment = !!selectedPayment;

  useEffect(() => {
    if (payment && hasSelectedPayment) {
      setEditValues({
        domainPrice: String(selectedPaymentDomainPrice ?? ""),
        hostingPrice: String(payment.hostingPrice ?? ""),
        generationPrice: String(payment.generationPrice ?? ""),
        totalAmount: String(payment.totalAmount ?? ""),
      });
    }
  }, [payment, hasSelectedPayment, selectedPaymentDomainPrice]);

  // Reset the create form whenever a different website's modal opens
  const selectedPaymentId = selectedPayment?.id;

  useEffect(() => {
    if (selectedPaymentId === undefined) {
      setCreateValues(emptyPaymentForm);
      return;
    }

    setCreateValues({
      domainPrice: String(selectedPaymentDomainPrice ?? ""),
      hostingPrice: "",
      generationPrice: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });
  }, [selectedPaymentId, selectedPaymentDomainPrice]);

  const roundDown = (val: unknown) => Math.floor(Number(val) || 0);

  const formatCurrency = (amount: number, isInternational?: boolean) => {
    return isInternational
      ? `$ ${roundDown(amount)}`
      : `Nu. ${roundDown(amount)}`;
  };

  const calculateTotal = ({
    domainPrice,
    hostingPrice,
    generationPrice,
  }: {
    domainPrice: string | number;
    hostingPrice: string | number;
    generationPrice: string | number;
  }) => {
    return (
      Number(domainPrice || 0) +
      Number(hostingPrice || 0) +
      Number(generationPrice || 0)
    );
  };

  const calculatedTotal = calculateTotal({
    domainPrice: editValues.domainPrice,
    hostingPrice: editValues.hostingPrice,
    generationPrice: editValues.generationPrice,
  });

  const calculatedCreateTotal =
    Number(createValues.domainPrice || 0) +
    Number(createValues.hostingPrice || 0) +
    Number(createValues.generationPrice || 0);
  const updateQuery = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);

    if (key === "websiteId") params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  const closePaymentModal = () => {
    setSelectedPayment(null);
    setIsEditingPayment(false);
  };

  const handleSavePayment = async () => {
    if (!selectedPayment) return;

    const price = Number(editValues.domainPrice);

    if (!Number.isFinite(price) || price < 0) {
      toast.error("Please enter a valid domain price");
      return;
    }

    if (!selectedPayment.domainId) {
      toast.error("Domain ID is missing");
      return;
    }

    updateDomainPrice(
      { domainId: selectedPayment.domainId, domainPrice: price },
      {
        onSuccess: () => {
          setSelectedPayment((prev) =>
            prev ? { ...prev, domainPrice: price } : null,
          );
          updatePayment({
            websiteId: selectedPayment.id,
            data: {
              hostingPrice: Number(editValues.hostingPrice) || 0,
              generationPrice: Number(editValues.generationPrice) || 0,
              totalAmount: calculatedTotal,
            },
          });
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update domain price",
          );
        },
      },
    );
  };

  const handleCreatePayment = () => {
    if (!selectedPayment) return;

    const domainPrice = Number(createValues.domainPrice) || 0;
    const hostingPrice = Number(createValues.hostingPrice) || 0;
    const generationPrice = Number(createValues.generationPrice) || 0;

    const totalAmount = domainPrice + hostingPrice + generationPrice;

    if (domainPrice < 0) {
      toast.error("Please enter a valid domain price");
      return;
    }

    if (!selectedPayment.domainId) {
      toast.error("Domain ID is missing");
      return;
    }

    createPayment({
      websiteId: selectedPayment.id,
      hostingPrice,
      generationPrice,
      totalAmount,
      paymentDate: createValues.paymentDate || undefined,
    });
  };

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
                    No approved websites found.
                  </TableCell>
                </TableRow>
              ) : (
                websites.map((site, index) => {
                  const serialNumber = (currentPage - 1) * 10 + index + 1;
                  const total = Number(site.totalAmount || 0);

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
                          {formatCurrency(total, site.country !== "BT")}{" "}
                          <Info className="h-3 w-3" />
                        </button>
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
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(site)}
                            className="h-8 gap-2 hover:bg-blue-50 hover:text-blue-700"
                          >
                            View Payment
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
          {isPriceBreakdownLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          ) : (
            <div className="space-y-3 py-4">
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">
                  Domain Registration
                </span>
                <span className="tabular-nums font-medium">
                  {roundDown(selectedPrice?.domainPrice)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">Hosting Plan</span>
                <span className="tabular-nums font-medium">
                  {roundDown(
                    priceBreakdownPayment?.hostingPrice ??
                      selectedPrice?.hostingPrice,
                  )}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">AI Generation Fee</span>
                <span className="tabular-nums font-medium">
                  {roundDown(
                    priceBreakdownPayment?.generationPrice ??
                      selectedPrice?.websitePrice,
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-green-600">
                  {formatCurrency(
                    Number(
                      priceBreakdownPayment?.totalAmount ??
                        selectedPrice?.totalAmount ??
                        0,
                    ),
                    selectedPrice?.country !== "BT",
                  )}
                </span>
              </div>
            </div>
          )}
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

      {/* --- VIEW / EDIT / CREATE PAYMENT MODAL --- */}
      <Dialog open={!!selectedPayment} onOpenChange={closePaymentModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border shadow-xl">
          <div className="border-b px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Payment Details
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Transaction record for{" "}
                <span className="font-medium text-foreground">
                  {selectedPayment?.title}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5 space-y-6">
            {isPaymentLoading ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Loading payment details...
              </p>
            ) : !payment ? (
              <>
                <p className="text-sm text-muted-foreground">
                  No payment record found for this website. Add one below.
                </p>

                <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Domain Price
                      </p>
                      <Input
                        type="number"
                        min="0"
                        className="mt-1 h-8"
                        value={createValues.domainPrice}
                        onChange={(e) =>
                          setCreateValues((prev) => ({
                            ...prev,
                            domainPrice: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Hosting Price
                      </p>
                      <Input
                        type="number"
                        className="mt-1 h-8"
                        value={createValues.hostingPrice}
                        onChange={(e) =>
                          setCreateValues((prev) => ({
                            ...prev,
                            hostingPrice: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Generation Price
                      </p>
                      <Input
                        type="number"
                        className="mt-1 h-8"
                        value={createValues.generationPrice}
                        onChange={(e) =>
                          setCreateValues((prev) => ({
                            ...prev,
                            generationPrice: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Total Amount
                      </p>
                      <Input
                        type="number"
                        className="mt-1 h-8"
                        value={calculatedCreateTotal}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment Date
                  </p>
                  <Input
                    type="date"
                    className="mt-1 h-8"
                    value={createValues.paymentDate}
                    onChange={(e) =>
                      setCreateValues((prev) => ({
                        ...prev,
                        paymentDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Domain Price
                      </p>

                      {isEditingPayment ? (
                        <Input
                          type="number"
                          min="0"
                          className="mt-1 h-8"
                          value={editValues.domainPrice}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              domainPrice: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(
                            Number(selectedPayment?.domainPrice || 0),
                            selectedPayment?.country !== "BT",
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Hosting Price
                      </p>
                      {isEditingPayment ? (
                        <Input
                          type="number"
                          className="mt-1 h-8"
                          value={editValues.hostingPrice}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              hostingPrice: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(
                            payment.hostingPrice,
                            selectedPayment?.country !== "BT",
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Generation Price
                      </p>
                      {isEditingPayment ? (
                        <Input
                          type="number"
                          className="mt-1 h-8"
                          value={editValues.generationPrice}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              generationPrice: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(
                            payment.generationPrice,
                            selectedPayment?.country !== "BT",
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Amount
                    </span>
                    {isEditingPayment ? (
                      <Input
                        type="number"
                        className="h-8 w-32 text-right"
                        value={calculatedTotal}
                        readOnly
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {formatCurrency(
                          payment.totalAmount,
                          selectedPayment?.country !== "BT",
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment Date
                  </p>
                  <p className="text-sm mt-1">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString(
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
              </>
            )}
          </div>

          <div className="border-t px-6 py-4 flex justify-end gap-2 bg-muted/20">
            {!isPaymentLoading && !payment && (
              <>
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={closePaymentModal}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  disabled={isCreating}
                  onClick={handleCreatePayment}
                >
                  <Plus className="h-4 w-4" />
                  {isCreating ? "Adding..." : "Add Payment"}
                </Button>
              </>
            )}

            {payment && !isEditingPayment && (
              <Button
                variant="outline"
                className="rounded-lg gap-2"
                onClick={() => setIsEditingPayment(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}

            {payment && isEditingPayment && (
              <Button
                variant="outline"
                className="rounded-lg"
                onClick={() => {
                  setIsEditingPayment(false);
                  setEditValues({
                    domainPrice: String(selectedPayment?.domainPrice ?? ""),
                    hostingPrice: String(payment.hostingPrice ?? ""),
                    generationPrice: String(payment.generationPrice ?? ""),
                    totalAmount: String(payment.totalAmount ?? ""),
                  });
                }}
              >
                Cancel
              </Button>
            )}

            {payment && isEditingPayment && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isUpdating}
                onClick={handleSavePayment}
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            )}

            {payment && !isEditingPayment && (
              <Button
                variant="outline"
                className="rounded-lg"
                onClick={closePaymentModal}
              >
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
