"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide navbar on dashboard routes
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/user");
  
  if (isDashboard) {
    return null;
  }
  
  return <Navbar />;
}
