"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ onAction }: { onAction?: () => void }) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        onAction?.();
        window.setTimeout(() => window.print(), 0);
      }}
      className="gap-2"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      PDF 저장
    </Button>
  );
}
