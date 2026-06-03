"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
      <Printer className="h-4 w-4" aria-hidden="true" />
      PDF 다운로드/인쇄
    </Button>
  );
}
