"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  Info,
  LayoutDashboard,
  Table,
  PlusCircle,
  User,
  LogOut,
} from "lucide-react";

export default function SubNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  const items = [
    { name: "Review Monitor AI", href: "/", isLogo: true },
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Review Table", href: "/reviews", icon: Table },
    { name: "Submit Review", href: "/submitReview", icon: PlusCircle },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-8 h-16 w-full">

        {/* Navbar Links */}
        <div className="flex items-center gap-6">
          {items.map((item, index) => {
            if (item.isLogo) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent whitespace-nowrap"
                >
                  {item.name}
                </Link>
              );
            }

            const Icon = item.icon;

            return (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-2 text-gray-600 text-sm font-medium hover:text-purple-600 transition-all duration-200 relative group whitespace-nowrap"
              >
                <Icon size={18} />
                <span className="relative">
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
