"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <Button type="button" variant="danger" onClick={onReset} className="gap-2">
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      초기화
    </Button>
  );
}
