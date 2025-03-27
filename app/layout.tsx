import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Тестовое задание для Itstart",
  description: "Тестовое задание для Itstart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={montserrat.className} lang="en">
      <body>
        <header className="header__container">
          <Link href="/" className="header__container--link">Home</Link>
          <Link href="/seminars" className="header__container--link">Seminars</Link>
          <Link href="/edit" className="header__container--link">Edit</Link>
        </header>
        <main className="container">
          {children}
        </main>

      </body>
    </html>
  );
}
