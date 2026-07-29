"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import type { CalculatorConfig, FieldValue } from "@/types/calculator";
import { copyText, createShareUrl } from "@/lib/share-url";
import { Button } from "@/components/ui/button";

export function ShareButton({
  config,
  values,
  onAction,
}: {
  config: CalculatorConfig;
  values: Record<string, FieldValue>;
  onAction?: () => void;
}) {
  const [message, setMessage] = useState("");

  async function handleShare() {
    onAction?.();
    window.alert("공유 URL에는 이 계산기에 입력한 숫자와 선택값만 포함됩니다. 이름, 전화번호, 이메일, 상세주소 같은 개인정보는 입력하지 마세요.");
    const url = createShareUrl(config, window.location.origin, values);
    const copied = await copyText(url);
    setMessage(copied ? "공유 URL이 복사되었습니다." : url);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handleShare} className="w-full gap-2 sm:w-auto">
        <Link2 className="h-4 w-4" aria-hidden="true" />
        공유 링크 복사
      </Button>
      {message ? <p className="max-w-sm break-all text-xs leading-5 text-foreground" role="status">{message}</p> : null}
    </div>
  );
}
