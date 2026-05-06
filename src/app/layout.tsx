import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AIChatbot from "@/components/features/AIChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TravelAI - Smart Travel Booking",
  description: "AI-Powered Travel Booking Platform for personalized recommendations and itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <NavbarWrapper />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <AIChatbot />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
