"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Templates", href: "#templates" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const LOGIN_URL = `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`;
const SIGNUP_URL = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup`;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex items-center">
            <Image
              src="/images/Sencill_AI_logo.png"
              alt="Sencill AI"
              width={120}
              height={40}
              priority
              className="h-auto w-[120px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <a href={LOGIN_URL}>Log in</a>
            </Button>

            <Button size="sm" asChild>
              <a href={SIGNUP_URL}>Get started</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-md p-2 hover:bg-muted md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border/50 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-3 border-t border-border/50" />

              <div className="flex flex-col gap-2">
                <Button variant="ghost" asChild className="w-full">
                  <a href={LOGIN_URL} onClick={closeMenu}>
                    Log in
                  </a>
                </Button>

                <Button asChild className="w-full">
                  <a href={SIGNUP_URL} onClick={closeMenu}>
                    Get started
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
