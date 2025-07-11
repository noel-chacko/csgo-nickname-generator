import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSGO Nickname Generator",
  description: "Generate CSGO-style nicknames inspired by professional players. Create unique, mixed-case nicknames with letter substitutions and numbers.",
  keywords: "CSGO, nickname, generator, gaming, esports, counter-strike",
  authors: [{ name: "CSGO Nickname Generator" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
