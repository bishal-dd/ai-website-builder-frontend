"use client";

import { useState } from "react";
import { Loader2, Mail, Plus, RefreshCw, Server, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

import { useGetDomainEmailDnsRecords } from "../hooks/useGetDomainEmailDnsRecords";
import { useSaveDomainEmailDnsRecords } from "../hooks/useSaveDomainEmailDnsRecords";
import { useDeleteDomainEmailDnsRecord } from "../hooks/useDeleteDomainEmailDnsRecord";
import type { EmailDnsRecord, EmailDnsRecordType } from "../types/dns";

interface DomainDnsPanelProps {
  domainId: string;
}

export function DomainDnsPanel({ domainId }: DomainDnsPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingRecordKey, setDeletingRecordKey] = useState<string | null>(
    null,
  );

  const [host, setHost] = useState("@");
  const [type, setType] = useState<EmailDnsRecordType>("MX");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState("1800");
  const [priority, setPriority] = useState("10");

  const { records, isLoading, isFetching, error, refetch } =
    useGetDomainEmailDnsRecords(domainId);

  const saveEmailDns = useSaveDomainEmailDnsRecords();
  const deleteEmailDns = useDeleteDomainEmailDnsRecord();

  const resetForm = () => {
    setHost("@");
    setType("MX");
    setValue("");
    setTtl("1800");
    setPriority("10");
  };

  const getRecordKey = (record: EmailDnsRecord, index: number) => {
    return `${record.host}-${record.type}-${record.value}-${record.priority ?? "none"}-${index}`;
  };

  const handleSaveRecord = () => {
    if (!host.trim() || !value.trim()) return;

    saveEmailDns.mutate(
      {
        domainId,
        records: [
          {
            host: host.trim(),
            type,
            value: value.trim(),
            ttl: Number(ttl || 1800),
            priority: type === "MX" ? Number(priority || 10) : undefined,
          },
        ],
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        },
      },
    );
  };

  const handleDeleteRecord = (record: EmailDnsRecord, index: number) => {
    const recordKey = getRecordKey(record, index);

    setDeletingRecordKey(recordKey);

    deleteEmailDns.mutate(
      {
        domainId,
        record,
      },
      {
        onSettled: () => {
          setDeletingRecordKey(null);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Fetching saved email DNS records...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
        <p className="text-sm font-medium text-destructive">
          Failed to load email DNS records.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          These records are fetched from our database, not directly from
          Namecheap.
        </p>

        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4 border-muted/80 bg-background/60 p-4">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-sm font-bold tracking-tight">
            Email DNS Records
          </h4>
          <p className="text-xs text-muted-foreground">
            Add and manage email DNS records. Website A records are not shown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 size-3.5" />
                Add Record
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Email DNS Record</DialogTitle>
                <DialogDescription>
                  Add an email-related DNS record such as MX, TXT/SPF, DMARC, or
                  DKIM.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Host</label>
                  <Input
                    placeholder="@, _dmarc, default._domainkey"
                    value={host}
                    onChange={(event) => setHost(event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use <span className="font-mono">@</span> for the root
                    domain. Use <span className="font-mono">_dmarc</span> for
                    DMARC.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Record Type</label>
                  <Select
                    value={type}
                    onValueChange={(selectedType) =>
                      setType(selectedType as EmailDnsRecordType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MX">MX Record</SelectItem>
                      <SelectItem value="TXT">TXT Record</SelectItem>
                      <SelectItem value="CNAME">CNAME Record</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    placeholder={
                      type === "MX"
                        ? "mx1.privateemail.com"
                        : type === "TXT"
                          ? "v=spf1 include:spf.privateemail.com ~all"
                          : "provider-domain.example.com"
                    }
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the destination or text value provided by the email
                    provider.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TTL</label>
                    <Input
                      type="number"
                      min={60}
                      placeholder="1800"
                      value={ttl}
                      onChange={(event) => setTtl(event.target.value)}
                    />
                  </div>

                  {type === "MX" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="10"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {saveEmailDns.isError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {saveEmailDns.error instanceof Error
                    ? saveEmailDns.error.message
                    : "Failed to save email DNS record."}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saveEmailDns.isPending}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSaveRecord}
                  disabled={
                    saveEmailDns.isPending || !host.trim() || !value.trim()
                  }
                >
                  {saveEmailDns.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Save Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 size-3.5" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {deleteEmailDns.isError && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {deleteEmailDns.error instanceof Error
            ? deleteEmailDns.error.message
            : "Failed to delete email DNS record."}
        </div>
      )}

      {records.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
          <Mail className="mx-auto mb-2 size-5 text-muted-foreground" />
          <p className="text-sm font-medium">No email DNS records saved</p>
          <p className="text-xs text-muted-foreground">
            Add MX, TXT, or CNAME records provided by the user’s email provider.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Host</th>
                  <th className="px-4 py-3 text-left font-bold">Type</th>
                  <th className="px-4 py-3 text-left font-bold">Value</th>
                  <th className="px-4 py-3 text-left font-bold">TTL</th>
                  <th className="px-4 py-3 text-left font-bold">Priority</th>
                  <th className="px-4 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {records.map((record, index) => {
                  const recordKey = getRecordKey(record, index);
                  const isDeleting = deletingRecordKey === recordKey;

                  const isEmailRecord =
                    record.type === "MX" ||
                    record.type === "TXT" ||
                    record.host === "_dmarc" ||
                    record.host.includes("_domainkey");

                  return (
                    <tr key={recordKey} className="bg-background/40">
                      <td className="px-4 py-3 font-mono text-xs">
                        {record.host}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-md font-mono text-[10px]",
                            record.type === "MX"
                              ? "bg-blue-100 text-blue-700"
                              : record.type === "TXT"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-emerald-100 text-emerald-700",
                          )}
                        >
                          {isEmailRecord ? (
                            <Mail className="mr-1 size-3" />
                          ) : (
                            <Server className="mr-1 size-3" />
                          )}
                          {record.type}
                        </Badge>
                      </td>

                      <td
                        className="max-w-[360px] truncate px-4 py-3 font-mono text-xs text-muted-foreground"
                        title={record.value}
                      >
                        {record.value}
                      </td>

                      <td className="px-4 py-3 font-mono text-xs">
                        {record.ttl ?? "-"}
                      </td>

                      <td className="px-4 py-3 font-mono text-xs">
                        {record.type === "MX" ? (record.priority ?? "-") : "-"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          disabled={isDeleting || deleteEmailDns.isPending}
                          onClick={() => handleDeleteRecord(record, index)}
                          aria-label={`Delete ${record.type} record`}
                        >
                          {isDeleting ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}
