"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenText, Calculator, ChevronDown, Heart, Info, Mail, Menu, NotebookPen, X } from "lucide-react";

const primaryCalculatorLinks = [
  { href: "/calculators/wedding-cost", label: "결혼 비용" },
  { href: "/calculators/newlywed-home-budget", label: "신혼집 예산" },
  { href: "/calculators/wedding-hall-cost", label: "웨딩홀 비용" },
  { href: "/calculators/studio-dress-makeup-cost", label: "스드메 비용" },
  { href: "/calculators/honsu-budget", label: "혼수 비용" },
  { href: "/calculators/wedding-gift-budget", label: "예물 예산" },
  { href: "/calculators/honeymoon-budget", label: "신혼여행" },
  { href: "/calculators/congratulatory-money", label: "축의금" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const featuredMobileCalculatorLinks = primaryCalculatorLinks.slice(0, 2);
  const secondaryMobileCalculatorLinks = primaryCalculatorLinks.slice(2);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-blush-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-black text-blush-800" aria-label="웨딩 예산 계산기 홈">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-blush-700">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg">웨딩 예산 계산기</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
          <div className="relative" onMouseEnter={() => setCalculatorOpen(true)} onMouseLeave={() => setCalculatorOpen(false)}>
            <button
              type="button"
              onClick={() => setCalculatorOpen((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setCalculatorOpen(false);
                }
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-200"
              aria-expanded={calculatorOpen}
              aria-controls="desktop-calculator-menu"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              계산기
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
            <div
              id="desktop-calculator-menu"
              className={
                calculatorOpen
                  ? "visible absolute right-0 top-full w-[28rem] translate-y-0 rounded-3xl border border-blush-100 bg-white p-3 opacity-100 shadow-soft transition"
                  : "invisible absolute right-0 top-full w-[28rem] translate-y-2 rounded-3xl border border-blush-100 bg-white p-3 opacity-0 shadow-soft transition"
              }
            >
              <div className="grid grid-cols-2 gap-2">
                {primaryCalculatorLinks.map((calculator) => (
                  <Link
                    key={calculator.href}
                    href={calculator.href}
                    onClick={() => setCalculatorOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-blush-50 hover:text-blush-800"
                  >
                    {calculator.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
          >
            <BookOpenText className="h-4 w-4" aria-hidden="true" />
            가이드
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
          >
            <NotebookPen className="h-4 w-4" aria-hidden="true" />
            계산 기준
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-black text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            문의
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/calculators/wedding-cost" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-blush-200 px-4 py-2 text-sm font-bold text-blush-800 transition hover:bg-blush-50">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            계산 시작
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blush-200 text-blush-800 transition hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-200"
            aria-label="모바일 메뉴"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {mobileOpen ? (
        <nav id="mobile-navigation" className="border-t border-blush-100 bg-white px-4 py-4 lg:hidden" aria-label="모바일 주요 메뉴">
          <Link
            href="/calculators/wedding-cost"
            onClick={() => setMobileOpen(false)}
            className="mb-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-blush-800 px-4 py-3 text-sm font-black text-white transition hover:bg-blush-700"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            계산 시작
          </Link>
          <div className="grid gap-2">
            {featuredMobileCalculatorLinks.map((calculator) => (
              <Link
                key={calculator.href}
                href={calculator.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-blush-50 hover:text-blush-800"
              >
                {calculator.label}
              </Link>
            ))}
          </div>
          <details className="mt-2 rounded-2xl border border-blush-100 bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-black text-slate-700">다른 계산기</summary>
            <div className="grid gap-1 px-2 pb-2">
              {secondaryMobileCalculatorLinks.map((calculator) => (
                <Link
                  key={calculator.href}
                  href={calculator.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
                >
                  {calculator.label}
                </Link>
              ))}
            </div>
          </details>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-blush-100 pt-3">
            {[
              { href: "/guides", label: "가이드", icon: BookOpenText },
              { href: "/methodology", label: "계산 기준", icon: NotebookPen },
              { href: "/contact", label: "문의", icon: Mail },
              { href: "/about", label: "소개", icon: Info },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-blush-50 hover:text-blush-800"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
