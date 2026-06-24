import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "퍼시픽 리그 | PACIFIC LEAGUE",
  description:
    "김포 아이스링크에서 열리는 성인 취미 아이스하키 리그, 퍼시픽 리그. 경기 일정·결과·순위·참가팀 정보를 한눈에.",
  openGraph: {
    title: "퍼시픽 리그 | PACIFIC LEAGUE",
    description: "김포 아이스링크 성인 취미 아이스하키 리그",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050b1c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />

        {/* ── 하단 고정 바텀 바 (4개 버튼) ── */}
        <nav className="bottom-nav" aria-label="하단 메뉴">
          <Link href="/" aria-label="홈">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
            </svg>
            <span>홈</span>
          </Link>
          <Link href="/schedule" aria-label="경기 일정">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
            <span>일정</span>
          </Link>
          <Link href="/teams" aria-label="참가팀">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
              <path d="M16 6.2a3 3 0 0 1 0 5.6M18 20c0-2.7-1-4.6-2.5-5.6" />
            </svg>
            <span>참가팀</span>
          </Link>
          <Link href="/standings" aria-label="순위표">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 21V9M12 21V4M17 21v-7" />
            </svg>
            <span>순위</span>
          </Link>
          <Link href="/videos" aria-label="영상">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="6" width="14" height="12" rx="2" /><path d="M16.5 10l5-3v10l-5-3z" />
            </svg>
            <span>영상</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
