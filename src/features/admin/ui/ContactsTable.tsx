"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, Phone, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUserContact } from "../api/getAdminContacts";
import { WebsiteDetailsModal } from "./WebsiteDetailsModal";

interface ContactsTableProps {
  users: AdminUserContact[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ContactsTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
}: ContactsTableProps) {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search");

  const [selectedUser, setSelectedUser] = useState<AdminUserContact | null>(
    null,
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="py-4 font-semibold text-slate-700">
                User
              </TableHead>
              <TableHead className="py-4 font-semibold text-slate-700">
                Primary Contact
              </TableHead>
              <TableHead className="py-4 font-semibold text-center text-slate-700">
                Websites
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-48 text-center text-muted-foreground"
                >
                  {currentSearch
                    ? `No results for "${currentSearch}"`
                    : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="group transition-colors">
                  {/* USER IDENTITY */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {user.name}
                        </span>
                        {user.banned && (
                          <span className="text-[10px] text-red-500 font-bold uppercase">
                            Banned
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* CONTACT INFO */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="size-3.5 text-slate-400" />
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {user.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="size-3.5 text-slate-400" />
                        <span>
                          {user.websites[0]?.contact_phone || "No phone added"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* PROJECT COUNT */}
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="gap-2 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Globe className="size-4" />
                      <span className="font-bold">{user.websites.length}</span>
                      <span className="text-xs text-muted-foreground">
                        Projects
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL FOR WEBSITE DETAILS */}
      <WebsiteDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* --- PAGINATION CONTROLS --- */}
      <div className="flex items-center justify-between px-2 py-2">
        <p className="text-sm text-muted-foreground">
          Page <span className="font-medium text-slate-900">{currentPage}</span>{" "}
          of{" "}
          <span className="font-medium text-slate-900">{totalPages || 1}</span>
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
