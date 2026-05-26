import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import ScrollReveal from "./components/ScrollReveal";
import "./globals.css";

export const metadata: Metadata = {
  title: "이슬기 · 기업PR 리더",
  description:
    "이슬기 · 카카오 기업PR 리더 포트폴리오 — 언론홍보 · 위기관리 · 보도자료 · 온라인홍보",
};

const themeInitScript = `(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);

    var l = localStorage.getItem('lang');
    if (l !== 'ko' && l !== 'en') l = 'ko';
    document.documentElement.setAttribute('lang', l);
  } catch (e) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>&copy; 2026 Portfolio. Built with Next.js, Supabase.</p>
          </div>
        </footer>
        <ScrollReveal />
      </body>
    </html>
  );
}
