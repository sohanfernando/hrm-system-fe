"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/components/providers/AuthProvider";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentPage = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-navbar items-center justify-between border-b border-border bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          className="focus-ring rounded-button p-2 text-foreground hover:bg-surface md:hidden"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-subheading text-foreground">{currentPage?.label ?? "HRM System"}</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-body text-foreground">{user.full_name}</span>
            <StatusBadge status={user.role} tone={user.role === "ADMIN" ? "primary" : "secondary"} />
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout} isLoading={isLoggingOut}>
          Log out
        </Button>
      </div>

      {isMobileMenuOpen && (
        <nav className="absolute left-0 right-0 top-navbar flex flex-col gap-1 border-b border-border bg-white p-4 shadow-dropdown md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`focus-ring flex items-center gap-3 rounded-button px-3 py-2 text-body font-medium ${
                  isActive ? "bg-primary-light text-primary-dark" : "text-secondary hover:bg-surface"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
