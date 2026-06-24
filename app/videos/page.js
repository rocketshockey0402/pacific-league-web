import Empty from "@/components/Empty";

export const metadata = { title: "영상 | 퍼시픽 리그" };

export default function VideosPage() {
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
          <Empty
            title="하이라이트 영상이 곧 공개됩니다 🎬"
            desc="경기 하이라이트가 준비되면 이곳에 업로드됩니다. 인스타그램에서도 만나보세요."
          />
        </div>
      </section>
    </>
  );
}
