import { canRenderAd, type AdPageKind, type AdPlacement } from "@/lib/ad-policy";
import { AdUnit } from "@/components/monetization/AdUnit";

export function AdBanner({
  slot = "top",
  label = "광고",
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

  if (!approved || !clientId || !slotId) return null;

  return (
    <aside className="no-print" aria-label={label}>
      <p className="mb-2 text-xs font-bold text-slate-500">광고</p>
      <AdUnit clientId={clientId} slotId={slotId} />
    </aside>
  );
}
