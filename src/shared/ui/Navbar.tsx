"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, ArrowLeft } from "lucide-react";
import { useSession } from "@/shared/session/useSession";
import Image from "next/image";

export default function Navbar() {
  const { user, signOut } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo, Back Arrow and Brand */}
        <div className="flex items-center gap-3">
          {/* Back arrow */}

          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-md p-1
                       text-gray-700 hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/SencillAI-logo.webp"
              alt="Sencill AI"
              width={150}
              height={150}
              className="rounded-lg"
              priority
            />
          </Link>
        </div>

        {/* Profile Dropdown - only show if authenticated */}
        {user ? (
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm
                           transition-all duration-200
                           hover:-translate-y-[1px] hover:shadow-md
                           active:translate-y-0 active:shadow-sm rounded-2xl
                           "
            >
              <a
                href="https://wa.me/97517959259?text=Hi%20I%20need%20help%20with%20my%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Image
                  src="/whatsapp-icon.svg"
                  alt="WhatsApp"
                  width={22}
                  height={22}
                />
                Help?
              </a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // If not authenticated, show login/signup buttons instead
          <Link href="/auth/login">
            <Button
              variant="default"
              className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground
                         hover:bg-primary/90 hover:scale-105 active:scale-95
                          transition-colors shadow-md rounded-lg"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
