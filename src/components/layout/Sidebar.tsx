"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-sidebar flex-col border-r border-border bg-white md:flex">
      <div className="flex h-navbar items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-button bg-primary text-body font-semibold text-white">
          H
        </div>
        <span className="text-subheading text-foreground">HRM System</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex items-center gap-3 rounded-button px-3 py-2 text-body font-medium transition-colors ${
                isActive
                  ? "bg-primary-light text-primary-dark"
                  : "text-secondary hover:bg-surface hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
