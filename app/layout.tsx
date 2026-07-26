import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SewaHub Nepal",
  description: "Trusted Local Services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        <Toaster />
      </body>
    </html>
  );
}