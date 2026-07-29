import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청한 주소가 없거나 이동된 경우 안내하는 웨딩 예산 계산기 404 페이지입니다.",
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-foreground">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-muted-foreground">주소가 잘못되었거나 더 이상 제공되지 않는 페이지입니다.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          홈으로 이동
        </Link>
        <Link href="/guides/" className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary">
          예산 가이드 모음 보기
        </Link>
        <Link href="/calculators/wedding-cost/" className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary">
          결혼식 예산표 만들기
        </Link>
      </div>
    </div>
  );
}
