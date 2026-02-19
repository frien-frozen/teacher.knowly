import { Suspense } from "react";
import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Optimize Fonts
const nunito = Nunito({
  subsets: ["latin", "cyrillic"], // Added Cyrillic for Uzbek
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Professional SEO Metadata
export const metadata: Metadata = {
  title: "KNOWLY | Quality Education.",
  description: "Free Cambridge & Pearson education for Uzbekistan. Master global standards with simple Uzbek explanations. 100% Free.",
  keywords: ["education", "uzbekistan", "cambridge", "pearson", "free learning", "video lessons", "igcse", "a-levels"],
  openGraph: {
    title: "KNOWLY | Free Quality Education",
    description: "Master global standards in your mother tongue.",
    url: "https://knowly.uz",
    siteName: "KNOWLY",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX: suppressHydrationWarning prevents errors from browser extensions & dynamic attributes
    <html lang="uz" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${jakarta.variable} antialiased bg-[#F2F4F7] text-[#101828] font-nunito selection:bg-[#D92D20] selection:text-white`}
      >
        <Suspense fallback={null}>
          <LanguageProvider>
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}

