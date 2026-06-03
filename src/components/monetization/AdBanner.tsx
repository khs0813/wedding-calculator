export function AdBanner({ slot = "top", label = "광고 영역" }: { slot?: "top" | "content" | "result"; label?: string }) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = slot === "top"
    ? process.env.NEXT_PUBLIC_AD_SLOT_TOP
    : slot === "result"
      ? process.env.NEXT_PUBLIC_AD_SLOT_RESULT
      : process.env.NEXT_PUBLIC_AD_SLOT_CONTENT;

  if (!clientId || !slotId) {
    return null;
    /*
    return (
      <aside className="no-print rounded-3xl border border-dashed border-rose-200 bg-rose-50/50 p-6 text-center text-sm text-rose-700" aria-label={label}>
        <p className="font-black">AdSense Placeholder</p>
        <p className="mt-2 text-rose-600">애드센스 승인 후 환경변수에 광고 클라이언트/슬롯 ID를 넣으면 이 영역을 실제 광고로 교체할 수 있습니다.</p>
      </aside>
    );
    */
  }

  return (
    <aside className="no-print" aria-label={label}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
