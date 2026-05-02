import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Generator",
  description: "Create a premium AI-powered portfolio with Clerk authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signInForceRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-slate-950 text-slate-50">
          <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#020617_40%,#0f172a_100%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
