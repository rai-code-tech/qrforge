import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "QRForge - AI-Powered QR Code Generator",
    template: "%s | QRForge",
  },
  description:
    "Create stunning, scannable QR codes with AI-powered artistic styles. Generate QR codes for URLs, WiFi, vCards, and more. Free to start.",
  keywords: [
    "QR code generator",
    "AI QR code",
    "artistic QR code",
    "custom QR code",
    "QR code maker",
    "free QR code",
  ],
  openGraph: {
    title: "QRForge - AI-Powered QR Code Generator",
    description:
      "Create stunning, scannable QR codes with AI-powered artistic styles.",
    type: "website",
    siteName: "QRForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRForge - AI-Powered QR Code Generator",
    description:
      "Create stunning, scannable QR codes with AI-powered artistic styles.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
