const inter = Inter({ subsets: ["latin"] });
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import {
  Topbar,
  LeftSidebar,
  RightSidebar,
  Bottombar,
} from "@/components/shared";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className="flex">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
