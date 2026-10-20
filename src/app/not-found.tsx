import Link from "next/link";

export default function NotFound() {
  return <main className="container narrow-page"><div className="eyebrow">404</div><h1>Không tìm thấy trang</h1><p>Trang bạn đang tìm không tồn tại hoặc đã được chuyển.</p><Link className="button button-coral" href="/vi">Về trang chủ</Link></main>;
}
