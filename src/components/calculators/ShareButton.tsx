"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import type { FieldValue } from "@/types/calculator";
import { copyText, createShareHash } from "@/lib/share-url";
import { Button } from "@/components/ui/button";

export function ShareButton({ values, onAction }: { values: Record<string, FieldValue>; onAction?: () => void }) {
  const [message, setMessage] = useState("");

  async function handleShare() {
    onAction?.();
    window.alert("공유 URL에는 입력한 숫자와 선택값이 포함될 수 있습니다. 이름, 전화번호, 이메일, 상세주소는 포함하지 마세요.");
    const url = `${window.location.origin}${window.location.pathname}${createShareHash(values)}`;
    const copied = await copyText(url);
    setMessage(copied ? "공유 URL이 복사되었습니다." : url);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handleShare} className="w-full gap-2 sm:w-auto">
        <Link2 className="h-4 w-4" aria-hidden="true" />
        상대와 공유하기
      </Button>
      {message ? <p className="max-w-sm break-all text-xs leading-5 text-foreground" role="status">{message}</p> : null}
    </div>
  );
}
