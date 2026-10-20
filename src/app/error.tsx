"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="container narrow-page"><div className="eyebrow">FitManager</div><h1>Có lỗi xảy ra</h1><p>Hệ thống không thể hoàn tất yêu cầu. Vui lòng thử lại.</p><button className="button button-coral" onClick={() => reset()}>Thử lại</button></main>;
}
