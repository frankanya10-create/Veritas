import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "@/components/Providers";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";

export const dynamic = "force-dynamic";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veritas — Multi-Agent Compliance Intelligence",
  description:
    "Multi-agent AI orchestration for financial compliance. Real-time transaction auditing, AML/KYT detection, and regulatory alignment deployed at the edge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://db.onlinewebfonts.com/c/9df35b2045f6e32dcfa5bbc421ed05b1?family=Lufga+Regular" />
        <style>{`@font-face{font-family:"Lufga Regular";src:url(https://db.onlinewebfonts.com/t/9df35b2045f6e32dcfa5bbc421ed05b1.woff2) format("woff2");font-display:swap}`}</style>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23000'/><text x='50' y='68' font-family='system-ui' font-size='56' font-weight='800' fill='%2300FF66' text-anchor='middle'>V</text></svg>" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white scanline-overlay noise-bg">
        <Providers>{children}</Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              border: "1px solid #333",
              color: "#fff",
              fontFamily: "var(--font-heading)",
              fontSize: "12px",
            },
          }}
        />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
