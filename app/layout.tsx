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
  title: "Knowly | Become a Teacher",
  description: "Apply to become a verified Knowly educator and help bring world-class Cambridge & Pearson education to every student in Uzbekistan.",
  keywords: ["knowly", "teacher", "education", "uzbekistan", "cambridge", "igcse", "a-levels", "pearson", "o'qituvchi"],
  metadataBase: new URL("https://teacher.knowly.uz"),
  openGraph: {
    title: "Knowly | Become a Teacher",
    description: "Apply to become a verified Knowly educator and bring world-class education to every student in Uzbekistan.",
    url: "https://teacher.knowly.uz",
    siteName: "Knowly for Teachers",
    locale: "uz_UZ",
    type: "website",
    images: [{ url: "/logos/knowly-full.png", width: 1200, height: 630, alt: "Knowly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowly | Become a Teacher",
    description: "Apply to join the Knowly educator network.",
    images: ["/logos/knowly-full.png"],
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

