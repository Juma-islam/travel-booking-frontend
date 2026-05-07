"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Settings, LogOut, Sun, Moon, User, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import VoyageLogo from "@/components/ui/VoyageLogo";

interface DashboardNavbarProps {
  onMenuClick?: () => void;
}

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Logo and title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-slate-600 dark:text-slate-300" />
          </button>

          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <VoyageLogo size={28} />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hidden sm:inline">
              Voyage<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-cyan-500">AI</span>
            </span>
          </Link>
        </div>

        {/* Right side - Actions and profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Link
            href="/user/notifications"
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </button>

          {/* Settings */}
          <Link
            href={user?.role === 'admin' ? '/admin/settings' : '/user/settings'}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
            aria-label="Settings"
          >
            <Settings size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white" />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline truncate">
                {user?.name}
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50">
                <Link
                  href={user?.role === 'admin' ? '/admin/profile' : '/user/profile'}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setProfileDropdown(false)}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>

                <Link
                  href={user?.role === 'admin' ? '/admin/settings' : '/user/settings'}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setProfileDropdown(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>

                <hr className="my-1 border-slate-200 dark:border-slate-700" />

                <button
                  onClick={() => {
                    handleLogout();
                    setProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
