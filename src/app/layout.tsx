import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medicare Dashboard",
  description:
    "Modern edge-first fullstack Medicare dashboard built with Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full dark-mode-transition`}>
        <ThemeProvider defaultTheme="system" storageKey="medicare-theme">
          <div className="min-h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
