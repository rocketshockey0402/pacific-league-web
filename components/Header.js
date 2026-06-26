import Link from "next/link";

const menu = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "대회 소개" },
  { href: "/schedule", label: "경기 일정" },
  { href: "/results", label: "경기 결과" },
  { href: "/standings", label: "순위표" },
  { href: "/teams", label: "참가팀" },
  { href: "/notices", label: "공지사항" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <nav className="nav">
          <Link href="/" className="brand">
            <img src="/logo.png.png" className="brand-logo" alt="퍼시픽 리그" />
            <span className="name">퍼시픽 리그</span>
          </Link>

          <div className="nav-links">
            {menu.map((m) => (
              <Link key={m.href} href={m.href}>
                {m.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
