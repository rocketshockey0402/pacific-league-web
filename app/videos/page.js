import { getVideos } from "@/lib/notion";
import { formatDate } from "@/lib/format";
import Empty from "@/components/Empty";

export const metadata = { title: "영상 | 퍼시픽 리그" };
export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <>
      <section className="page-title">
        <div className="container">
          <div className="eyebrow">HIGHLIGHTS</div>
          <h1>영상</h1>
          <p>경기 하이라이트와 리그 영상을 모아봅니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {videos.length === 0 ? (
            <Empty
              title="등록된 영상이 없어요 🎬"
              desc="노션 ‘영상’ DB에 유튜브 링크를 추가하면 이곳에 자동으로 재생됩니다."
            />
          ) : (
            <div className="grid grid-2">
              {videos.map((v) => (
                <div className="card video-card" key={v.id}>
                  {v.youtubeId ? (
                    <div className="video-frame">
                      <iframe
                        src={`https://www.youtube.com/embed/${v.youtubeId}`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    v.url && (
                      <a href={v.url} target="_blank" rel="noopener noreferrer" className="video-frame video-link">
                        ▶ 영상 보러가기
                      </a>
                    )
                  )}
                  <div className="video-meta">
                    <h3>{v.title}</h3>
                    <div className="when">{formatDate(v.date)}</div>
                    {v.desc && <p>{v.desc}</p>}
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
