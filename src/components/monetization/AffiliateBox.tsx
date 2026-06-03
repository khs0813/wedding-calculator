import { ExternalLink } from "lucide-react";
import type { AffiliateKey } from "@/types/calculator";
import { affiliateLabels } from "@/data/affiliateLinks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AffiliateBox({ keys }: { keys: AffiliateKey[] }) {
  const uniqueKeys = Array.from(new Set(keys));

  if (uniqueKeys.length === 0) return null;

  return (
    <Card className="no-print bg-white">
      <CardHeader>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-500">Partners</p>
        <h2 className="text-2xl font-black text-slate-950">관련 준비 항목</h2>
        <p className="text-sm text-slate-500">추후 제휴 링크를 연결할 수 있도록 컴포넌트화된 영역입니다.</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {uniqueKeys.map((key) => {
            const item = affiliateLabels[key];
            return (
              <a
                key={key}
                href={item.url}
                target={item.url === "#" ? undefined : "_blank"}
                rel={item.url === "#" ? undefined : "noopener noreferrer"}
                className="rounded-3xl border border-rose-100 bg-rose-50/50 p-5 transition hover:border-rose-200 hover:bg-rose-50"
              >
                <span className="flex items-center gap-2 font-black text-slate-950">
                  {item.title}
                  <ExternalLink className="h-4 w-4 text-rose-500" aria-hidden="true" />
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
