import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { ScriptProvider } from "@/components/script/ScriptProvider";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import { siteSettings } from "@/data/site";
import { SCRIPT_COOKIE, parseScript } from "@/lib/site-script";
import "./globals.css";

const heading = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  variable: "--font-heading",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const script = parseScript((await cookies()).get(SCRIPT_COOKIE)?.value);

  return (
    <html lang="sr" data-scroll-behavior="smooth" className={`${heading.variable} ${body.variable}${script === "lat" ? " pismo-lat" : ""}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "setTimeout(function(){document.documentElement.classList.add('pismo-spremno')},3000)",
          }}
        />
        <noscript>
          <style>{`html.pismo-lat body{visibility:visible!important}`}</style>
        </noscript>
        <ThemeRegistry>
          <ScriptProvider initialScript={script}>{children}</ScriptProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
