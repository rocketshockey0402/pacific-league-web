import "./globals.css";
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
      </body>
    </html>
  );
}
