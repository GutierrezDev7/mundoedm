import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DataProvider } from "@/lib/data-context";

const gotham = localFont({
  src: [
    { path: "../public/fonts/Gotham Thin/Gotham Thin.otf", weight: "100", style: "normal" },
    { path: "../public/fonts/Gotham Extra Light/Gotham Extra Light.otf", weight: "200", style: "normal" },
    { path: "../public/fonts/Gotham Light/Gotham Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Gotham Book/Gotham Book.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Gotham Regular/Gotham Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Gotham Medium/Gotham Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/Gotham Bold/Gotham Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/Gotham Black/Gotham Black.otf", weight: "800", style: "normal" },
    { path: "../public/fonts/Gotham Ultra/Gotham Ultra.otf", weight: "900", style: "normal" },
    { path: "../public/fonts/Gotham Italic/Gotham Italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/Gotham ItalicBold/Gotham ItalicBold.otf", weight: "700", style: "italic" },
    { path: "../public/fonts/Gotham Bold Italic/Gotham Bold Italic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-gotham",
  display: "swap",
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Mundo EDM",
  description: "Um santuário digital para as memórias da música eletrônica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={gotham.variable}>
      <body className={`${gotham.variable} font-sans antialiased`}>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
