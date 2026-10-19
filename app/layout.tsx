import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { siteSettings } from "@/data/site";
import "./globals.css";

const heading = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heading",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteSettings.seoTitle,
    template: "%s | ЕТШ „Михајло Пупин“",
  },
  description: siteSettings.seoDescription,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sr" className={`${heading.variable} ${body.variable}`}>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
