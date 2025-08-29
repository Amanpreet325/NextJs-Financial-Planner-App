import type { Metadata } from "next";
import { Providers } from "../components/providers"
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Financix — Smart Financial Planning Made Simple",
  description: "Expert financial guidance and investment strategies designed to secure your future with Financix.",
  generator: "Financix App",
  openGraph: {
    siteName: "Financix",
    title: "Smart Financial Planning Made Simple | Financix",
    description: "Expert financial guidance and investment strategies designed to secure your future with Financix.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
      <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <head />
        <body className="font-sans bg-slate-900 text-slate-100 overflow-x-hidden">
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </>
  );
}
