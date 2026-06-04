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
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="inline-flex rounded-full bg-blush-800 px-6 py-3 text-sm font-black text-white hover:bg-blush-700">
          홈으로 이동
        </Link>
        <Link href="/guides" className="inline-flex rounded-full border border-blush-200 bg-white px-6 py-3 text-sm font-black text-blush-800 hover:bg-blush-50">
          가이드 보기
        </Link>
        <Link href="/calculators/wedding-cost" className="inline-flex rounded-full border border-blush-200 bg-white px-6 py-3 text-sm font-black text-blush-800 hover:bg-blush-50">
          대표 계산기 열기
        </Link>
      </div>
    </div>
  );
}
