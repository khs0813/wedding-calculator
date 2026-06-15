"use client";

import { useState } from "react";
import type { FAQItem } from "@/types/calculator";

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  function toggle(question: string) {
    setOpenQuestions((current) => {
      const next = new Set(current);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-blush-100/70">
      {items.map((item, index) => {
        const open = openQuestions.has(item.question);
        const answerId = `faq-answer-${index}-${item.question.replace(/\s+/g, "-").replace(/[^\w가-힣-]/g, "")}`;

        return (
          <div key={item.question} className="py-5">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-base font-black text-slate-900"
              onClick={() => toggle(item.question)}
              aria-expanded={open}
              aria-controls={answerId}
            >
              <span className="faq-question min-w-0 flex-1">{item.question}</span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-50 text-lg font-black text-blush-800" aria-hidden="true">
                {open ? "-" : "+"}
              </span>
              <span className="sr-only">{open ? "답변 닫기" : "답변 열기"}</span>
            </button>
            {open ? (
              <p id={answerId} className="mt-3 text-sm leading-7 text-slate-600">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
