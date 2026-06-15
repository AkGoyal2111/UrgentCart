"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, AlertTriangle, RotateCcw } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Ask AI", icon: Sparkles, href: "/ask-ai" },
  { label: "Emergency", icon: AlertTriangle, href: "/emergency" },
  { label: "Reorder", icon: RotateCcw, href: "/reorder" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#d5d9d9] shadow-[0_-1px_4px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] px-2 py-1 transition-colors ${
                isActive
                  ? "text-[#ff9900]"
                  : "text-[#565959] hover:text-[#0f1111]"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span
                className={`text-[10px] mt-0.5 ${
                  isActive ? "font-bold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
