import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-blush-700">404</p>
      <h1 className="mt-4 text-4xl font-black text-slate-950">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-slate-600">주소가 잘못되었거나 더 이상 제공되지 않는 페이지입니다.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-blush-800 px-6 py-3 text-sm font-black text-white hover:bg-blush-700">
        홈으로 이동
      </Link>
    </div>
  );
}
