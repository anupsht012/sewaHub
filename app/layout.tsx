import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KaamSewa Nepal",
  description: "Trusted Local Services",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster richColors />
      </body>
    </html>
  );
}