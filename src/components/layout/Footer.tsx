import Link from "next/link";
import { calculators } from "@/data/calculators";
import { guides } from "@/data/guides";
import { legalPages } from "@/data/legalPages";

export function Footer() {
  return (
    <footer className="no-print mt-20 border-t border-blush-100 bg-white/80">
      <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-10 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="text-lg font-black text-blush-800">웨딩 예산 계산기</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
            결혼 준비와 신혼집 예산을 계산하고, 실제 계약과 지출 판단에 필요한 가이드를 함께 제공하는 사이트입니다. 입력값은 서버 DB에 저장하지 않으며 현재 브라우저에서만 관리됩니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-black text-blush-800">
            <Link href="/about" className="hover:text-blush-700">사이트 소개</Link>
            <Link href="/editorial-policy" className="hover:text-blush-700">편집 기준</Link>
            <Link href="/methodology" className="hover:text-blush-700">계산 기준</Link>
            <Link href="/contact" className="hover:text-blush-700">문의</Link>
          </div>
        </div>
        <div>
          <p className="font-bold text-slate-900">계산기</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {calculators.map((calculator) => (
              <li key={calculator.slug}>
                <Link href={calculator.path} className="hover:text-blush-800">{calculator.shortTitle}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-slate-900">가이드</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/guides" className="font-bold text-blush-800 hover:text-blush-700">가이드 전체 보기</Link>
            </li>
            {guides.slice(0, 8).map((guide) => (
              <li key={guide.slug}>
                <Link href={guide.path} className="hover:text-blush-800">{guide.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-slate-900">정책</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {legalPages.map((page) => (
              <li key={page.slug}>
                <Link href={page.path} className="hover:text-blush-800">{page.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-blush-100 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Wedding Budget Calculator. 계산 결과와 가이드는 참고용이며 실제 계약 조건은 직접 확인해야 합니다.
      </div>
    </footer>
  );
}
