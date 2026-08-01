import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/get-user";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KaamSewa Nepal",
  description: "Trusted Local Services",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const user = await getCurrentUser();


  return (

    <html lang="en">

      <body className={poppins.className}>

        <LayoutWrapper user={user}>
          {children}
        </LayoutWrapper>


        <Toaster />


      </body>

    </html>

  );

}