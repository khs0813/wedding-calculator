"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Guide } from "@/types/calculator";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  "전체",
  "총예산",
  "웨딩홀",
  "스드메",
  "신혼집",
  "혼수",
  "예물",
  "신혼여행",
  "축의금",
  "체크리스트",
];

const guideCategoryBySlug: Record<string, string> = {
  "wedding-cost-guide": "총예산",
  "wedding-saving-tips": "총예산",
  "wedding-budget-timeline-guide": "체크리스트",
  "small-wedding-budget-guide": "총예산",
  "wedding-contract-check-guide": "체크리스트",
  "wedding-hall-checklist": "웨딩홀",
  "wedding-guest-budget-table-guide": "웨딩홀",
  "wedding-hall-meal-cost-table-guide": "웨딩홀",
  "sdme-options-guide": "스드메",
  "sdme-extra-cost-table-guide": "스드메",
  "newlywed-budget-guide": "신혼집",
  "newlywed-loan-planning-guide": "신혼집",
  "newlywed-home-initial-cost-guide": "신혼집",
  "honsu-priority-guide": "혼수",
  "appliance-budget-table-guide": "혼수",
  "wedding-gift-negotiation-guide": "예물",
  "honeymoon-destination-budget-guide": "신혼여행",
  "honeymoon-budget-ratio-guide": "신혼여행",
  "congratulatory-money-etiquette-guide": "축의금",
  "congratulatory-money-table-guide": "축의금",
};

function getGuideCategory(guide: Guide) {
  const mappedCategory = guideCategoryBySlug[guide.slug];
  if (mappedCategory) return mappedCategory;

  const text = `${guide.title} ${guide.description} ${guide.keywords.join(" ")}`;
  if (/웨딩홀|보증 인원|식대/.test(text)) return "웨딩홀";
  if (/스드메|드레스|헬퍼비|원본/.test(text)) return "스드메";
  if (/신혼집|대출|전세|입주|월세/.test(text)) return "신혼집";
  if (/혼수|가전|가구|청소/.test(text)) return "혼수";
  if (/예물|예단|양가|반지/.test(text)) return "예물";
  if (/신혼여행|허니문|여행/.test(text)) return "신혼여행";
  if (/축의금|하객/.test(text)) return "축의금";
  if (/체크리스트|계약|일정표/.test(text)) return "체크리스트";
  return "총예산";
}

export function GuideFilterList({ guides }: { guides: Guide[] }) {
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, []);

  const filteredGuides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const guideCategory = getGuideCategory(guide);
      const matchesCategory = category === "전체" || guideCategory === category;
      const haystack = `${guide.title} ${guide.description} ${guide.excerpt} ${guide.keywords.join(" ")}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, guides, query]);

  return (
    <div>
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <label className="relative block">
          <span className="sr-only">가이드 검색</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="궁금한 비용을 검색해보세요. 예: 보증 인원, 헬퍼비, 입주청소"
            className="flex h-11 w-full rounded-xl border border-input bg-background px-12 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="가이드 카테고리">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                category === item
                  ? "min-h-11 shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  : "min-h-11 shrink-0 rounded-xl border bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredGuides.map((guide) => (
          <Card key={guide.slug} className="h-full">
            <CardContent className="flex h-full flex-col p-6">
              <p className="text-sm text-muted-foreground">{getGuideCategory(guide)}</p>
              <h3 className="mt-3 text-xl font-semibold">
                <Link href={guide.path} className="hover:underline">
                  {guide.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.excerpt}</p>
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <p>작성: {guide.author.name}</p>
                <p>업데이트: {guide.updatedAt}</p>
              </div>
              <Link
                href={guide.path}
                className="mt-auto inline-flex min-h-11 w-fit items-center justify-center rounded-xl border bg-background px-5 py-2 text-left text-sm font-medium leading-5 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {guide.title} 읽기
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredGuides.length === 0 ? (
        <p className="mt-6 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          조건에 맞는 가이드가 없습니다. 다른 검색어를 입력해보세요.
        </p>
      ) : null}
    </div>
  );
}
