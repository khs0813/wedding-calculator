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
      {items.map((item) => {
        const open = openQuestions.has(item.question);
        const answerId = `faq-${item.question.replace(/\s+/g, "-").replace(/[^\w가-힣-]/g, "")}`;

        return (
          <div key={item.question} className="py-5">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-base font-black text-slate-900"
              onClick={() => toggle(item.question)}
              aria-expanded={open}
              aria-controls={answerId}
            >
              <span>{item.question}</span>
              <span className={open ? "rounded-full bg-blush-100 px-2 py-1 text-xs text-blush-800" : "rounded-full bg-blush-50 px-2 py-1 text-xs text-blush-700"}>
                {open ? "닫기" : "열기"}
              </span>
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
