"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Users, AlertCircle, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import useAdminContacts from "@/features/admin/hooks/useAdminContacts";
import { ContactsTable } from "./ui/ContactsTable";
import { useDebouncedCallback } from "./hooks/useDebounce";

export default function AdminContactsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Extract values directly from URL
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";

  // 2. Stateless URL Updater (The logic hub)
  const updateQuery = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Always reset to page 1 when searching
    if (key === "search") {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  // 3. Fetch data based on URL state
  const { users, pagination, isLoading, error } = useAdminContacts(
    page,
    10,
    searchQuery,
  );

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Contacts</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground shadow-md shadow-blue-100">
              <Users className="size-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                User Contacts
              </h1>
              <p className="text-muted-foreground text-sm">
                Direct access to owner details and associated projects.
              </p>
              <p className="text-muted-foreground text-sm">
                {pagination?.totalCount ?? 0} total users
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              key={searchQuery}
              placeholder="Search by name or email..."
              className="pl-10 bg-white"
              // Use defaultValue for stateless behavior
              defaultValue={searchQuery}
              onChange={(e) => updateQuery("search", e.target.value)}
            />
          </div>
        </header>

        <Separator className="mb-8" />

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[100px] w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          ) : (
            <ContactsTable
              users={users}
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={(newPage) =>
                updateQuery("page", newPage.toString())
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
