import { canRenderAd, type AdPageKind, type AdPlacement } from "@/lib/ad-policy";
import { AdUnit } from "@/components/monetization/AdUnit";

export function AdBanner({
  slot = "top",
  label = "광고 영역",
  pageKind = "guide-article",
}: {
  slot?: AdPlacement;
  label?: string;
  pageKind?: AdPageKind;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const approved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";
  const slotId = slot === "top"
    ? process.env.NEXT_PUBLIC_AD_SLOT_TOP
    : slot === "result"
      ? process.env.NEXT_PUBLIC_AD_SLOT_RESULT
      : process.env.NEXT_PUBLIC_AD_SLOT_CONTENT;

  if (!canRenderAd(pageKind, slot)) {
    return null;
  }

  if (!approved || !clientId || !slotId) {
    return (
      <aside className="no-print rounded-3xl border border-dashed border-slate-200 bg-white/70 p-5 text-center text-xs font-bold text-slate-400" aria-label={label}>
        광고 위치
      </aside>
    );
  }

  return (
    <aside className="no-print" aria-label={label}>
      <AdUnit clientId={clientId} slotId={slotId} />
    </aside>
  );
}
