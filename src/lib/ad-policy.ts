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
  "calculator",
];

export function isAdSenseApproved() {
  return process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";
}

export function canRenderAd(pageKind: AdPageKind, placement: AdPlacement) {
  if (!isAdSenseApproved()) {
    return (
      preApprovalAllowedPageKinds.includes(pageKind) &&
      placement === "content"
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

  if (pageKind === "calculator" && placement !== "content") {
    return false;
  }

  return true;
}
