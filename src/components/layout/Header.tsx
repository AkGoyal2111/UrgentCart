"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut, MapPin, Search } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.items.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const locationLabel = useUserStore((state) => state.locationLabel);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleProfileClick() {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setShowDropdown((v) => !v);
    }
  }

  function handleLogout() {
    setShowDropdown(false);
    logout();
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main nav bar */}
      <div className="bg-[#131921] flex items-center h-[60px] px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 flex-shrink-0 py-2 px-1 border border-transparent hover:border-white rounded-sm">
          <span className="text-xl">🛒</span>
          <span className="text-[18px] font-bold text-white tracking-tight">
            Urgent<span className="text-amazon-orange">Cart</span>
          </span>
        </Link>

        {/* Delivery location */}
        <button className="hidden sm:flex items-center gap-1 py-2 px-2 border border-transparent hover:border-white rounded-sm text-white">
          <MapPin className="h-4 w-4 text-white" />
          <div className="text-left">
            <p className="text-[10px] text-gray-300 leading-tight">Deliver to</p>
            <p className="text-xs font-bold leading-tight">{locationLabel || "Bangalore"}</p>
          </div>
        </button>

        {/* Search bar */}
        <div className="flex-1 flex items-center h-[40px] rounded-md overflow-hidden">
          <div className="flex-1 h-full">
            <div className="flex items-center h-full bg-white rounded-l-md">
              <Search className="h-4 w-4 text-gray-500 ml-3" />
              <input
                type="text"
                placeholder="Search for situations, products..."
                className="flex-1 h-full px-2 text-sm text-[#0f1111] placeholder:text-gray-500 outline-none bg-transparent"
                onClick={() => router.push('/ask-ai')}
                readOnly
              />
            </div>
          </div>
          <button
            onClick={() => router.push('/ask-ai')}
            className="h-full px-4 bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center rounded-r-md transition-colors"
          >
            <Search className="h-5 w-5 text-[#131921]" />
          </button>
        </div>

        {/* Account */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="flex flex-col py-2 px-2 border border-transparent hover:border-white rounded-sm text-white"
            aria-label={isAuthenticated ? "User menu" : "Login"}
          >
            <span className="text-[10px] text-gray-300 leading-tight">
              Hello, {isAuthenticated && user ? user.name.split(" ")[0] : "Sign in"}
            </span>
            <span className="text-xs font-bold leading-tight">Account</span>
          </button>

          {showDropdown && isAuthenticated && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-bold text-[#0f1111] truncate">{user?.name}</p>
                {user?.email && (
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                )}
              </div>
              <Link
                href="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0f1111] hover:bg-gray-50"
              >
                <User className="h-4 w-4" />
                Your Profile
              </Link>
              <Link
                href="/reorder"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#0f1111] hover:bg-gray-50"
              >
                📦 Your Orders
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#cc0c39] hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative flex items-center py-2 px-2 border border-transparent hover:border-white rounded-sm">
          <div className="relative">
            <ShoppingCart className="h-7 w-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amazon-orange text-[11px] font-bold text-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          </div>
          <span className="text-xs font-bold text-white ml-1 hidden sm:block">Cart</span>
        </Link>
      </div>

      {/* Secondary nav strip */}
      <div className="bg-[#232f3e] flex items-center h-[39px] px-3 sm:px-6 gap-1 overflow-x-auto no-scrollbar">
        <Link href="/" className="text-xs text-white font-medium px-2.5 py-1.5 hover:bg-white/10 rounded-sm whitespace-nowrap transition-colors">
          Home
        </Link>
        <Link href="/ask-ai" className="text-xs text-white font-medium px-2.5 py-1.5 hover:bg-white/10 rounded-sm whitespace-nowrap transition-colors">
          ✨ Ask AI
        </Link>
        <Link href="/emergency" className="text-xs text-white font-medium px-2.5 py-1.5 hover:bg-white/10 rounded-sm whitespace-nowrap transition-colors">
          🚨 Emergency
        </Link>
        <Link href="/reorder" className="text-xs text-white font-medium px-2.5 py-1.5 hover:bg-white/10 rounded-sm whitespace-nowrap transition-colors">
          📦 Reorder
        </Link>
        <span className="text-xs text-white/60 px-2.5 py-1.5 whitespace-nowrap">|</span>
        <span className="text-xs text-white font-medium px-2.5 py-1.5 whitespace-nowrap flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {locationLabel || "Koramangala, Bangalore"}
        </span>
      </div>
    </header>
  );
}
