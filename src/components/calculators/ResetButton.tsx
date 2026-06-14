"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResetButton({ onReset }: { onReset: () => void }) {
  function handleReset() {
    if (window.confirm("입력한 값을 모두 초기화할까요?")) {
      onReset();
    }
  }

  return (
    <Button type="button" variant="danger" onClick={handleReset} className="gap-2">
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      초기화
    </Button>
  );
}
