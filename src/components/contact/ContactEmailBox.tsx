"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { copyText } from "@/lib/share-url";

export function ContactEmailBox({ email = "webinquiry365@gmail.com" }: { email?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyText(email);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert(`이메일 주소 복사에 실패했습니다: ${email}`);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-border bg-muted/40 p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
        <span className="font-medium text-muted-foreground">이메일 주소:</span>
        <a
          href={`mailto:${email}`}
          id="contact-email"
          className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {email}
        </a>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={`mailto:${email}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          메일 보내기
        </a>
        <button
          type="button"
          id="copy-email-btn"
          data-email={email}
          onClick={handleCopy}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span>복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>이메일 주소 복사</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
