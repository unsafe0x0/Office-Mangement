import type { Metadata } from "next";
import { Raleway, Noto_Sans } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/context/QueryContext";
import ToastProvider from "@/context/ToastProvider";

const headingFont = Raleway({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Office Management System",
  description: "Manage your office efficiently with our comprehensive system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        <TanStackProvider>
          {children}
          <ToastProvider />
        </TanStackProvider>
      </body>
    </html>
  );
}
