import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bokna — Plateforme citoyenne du Sénégal",
  description:
    "Bokna permet aux citoyens du Sénégal de découvrir leur commune, proposer des idées, participer à la vie municipale et suivre l'actualité locale.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <SessionProviderWrapper session={session}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
