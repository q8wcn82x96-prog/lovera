import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Lovera — история вашей любви в одной ссылке",
  description:
    "Собери ваши фотографии, воспоминания и самые важные слова в один красивый цифровой сюрприз.",
};

export const viewport: Viewport = {
  themeColor: "#111013",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink font-sans text-milk">{children}</body>
    </html>
  );
}
