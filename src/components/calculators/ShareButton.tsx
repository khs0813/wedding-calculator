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
    const url = `${window.location.origin}${window.location.pathname}${createShareHash(values)}`;
    const copied = await copyText(url);
    setMessage(copied ? "공유 URL이 복사되었습니다." : url);
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="secondary" onClick={handleShare} className="gap-2">
        <Link2 className="h-4 w-4" aria-hidden="true" />
        결과 공유
      </Button>
      {message ? <p className="max-w-sm break-all text-xs leading-5 text-blush-800" role="status">{message}</p> : null}
    </div>
  );
}
