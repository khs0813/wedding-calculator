export type AdPageKind =
  | "home"
  | "guide-index"
  | "guide-article"
  | "calculator"
  | "summary"
  | "contact"
  | "policy"
  | "legal";

export type AdPlacement = "top" | "content" | "result";

const preApprovalAllowedPageKinds: AdPageKind[] = [
  "home",
  "guide-index",
  "guide-article",
];

export function isAdSenseApproved() {
  return process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";
}

export function canRenderAd(pageKind: AdPageKind, placement: AdPlacement) {
  if (!isAdSenseApproved()) {
    return (
      preApprovalAllowedPageKinds.includes(pageKind) &&
      placement !== "result"
    );
  }

  if (
    pageKind === "summary" ||
    pageKind === "contact" ||
    pageKind === "policy" ||
    pageKind === "legal"
  ) {
    return false;
  }

  if (pageKind === "calculator" && placement !== "top") {
    return false;
  }

  return true;
}
