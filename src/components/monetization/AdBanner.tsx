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
  const slotId = slot === "top"
    ? process.env.NEXT_PUBLIC_AD_SLOT_TOP
    : slot === "result"
      ? process.env.NEXT_PUBLIC_AD_SLOT_RESULT
      : process.env.NEXT_PUBLIC_AD_SLOT_CONTENT;

  if (!canRenderAd(pageKind, slot) || !clientId || !slotId) {
    return null;
  }

  return (
    <aside className="no-print" aria-label={label}>
      <AdUnit clientId={clientId} slotId={slotId} />
    </aside>
  );
}
