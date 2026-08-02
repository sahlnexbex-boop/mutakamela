import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Mutakamela Insurance | Protection for Today, Peace of Mind for Tomorrow",
  description: "Comprehensive insurance solutions for individuals, families, and businesses across Saudi Arabia. Get instant quotes for Motor, Travel, Life, and Visit Visa Insurance.",
  keywords: ["Mutakamela Insurance", "Saudi Arabia Insurance", "Motor Insurance", "Travel Insurance", "Life Insurance", "Visit Visa Insurance"],
  authors: [{ name: "Mutakamela Insurance" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} scroll-smooth antialiased`}>
      <body className="font-sans min-h-screen bg-[#F8F9FE] text-slate-900 overflow-x-hidden">
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
