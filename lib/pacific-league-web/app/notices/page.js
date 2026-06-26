import { getNotices } from "@/lib/notion";
import { formatDateFull } from "@/lib/format";
import Empty from "@/components/Empty";

export const metadata = { title: "공지사항 | 퍼시픽 리그" };
export const revalidate = 60;

const catBadge = (c) => {
  if (c === "중요") return "badge-accent";
  if (c === "일정") return "badge-ice";
  return "badge-steel";
};

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">NOTICE</div>
          <h1>공지사항</h1>
          <p>리그 운영 관련 안내와 소식입니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {notices.length === 0 ? (
            <Empty title="등록된 공지가 없어요" desc="노션 ‘공지사항’ DB에 공지를 추가하면 자동으로 표시됩니다." />
          ) : (
            <div className="card" style={{ padding: 6 }}>
              {notices.map((n) => (
                <div className="notice-item" key={n.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <span className="when">{formatDateFull(n.date)}</span>
                  <div style={{ flex: 1 }}>
                    <h3>
                      {n.pinned && <span className="badge badge-accent" style={{ marginRight: 6 }}>고정</span>}
                      <span className={`badge ${catBadge(n.category)}`} style={{ marginRight: 6 }}>{n.category}</span>
                      {n.title}
                    </h3>
                    {n.content && <p>{n.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
