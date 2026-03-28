"use client";

import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔐 Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Gradient Border */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-[1px]">
        {/* Navbar Content */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-white bg-clip-text text-transparent">
                Review Monitor AI
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-gray-300">
              <a href="#features" className="hover:text-white">Powerful Features</a>
              <a href="#how" className="hover:text-white">How It Works</a>
              <a href="#cta" className="hover:text-white">Ready to Get Started</a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:opacity-90 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden px-6 pb-6 text-gray-300 space-y-4">
              <a href="#features" className="block">Powerful Features</a>
              <a href="#how" className="block">How It Works</a>
              <a href="#cta" className="block">Ready to Get Started</a>

              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="block">Login</Link>
                  <Link href="/register" className="block">Register</Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:opacity-90 transition"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
