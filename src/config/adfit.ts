export type AdFitPlacement =
  | "calc.primaryAfterSummary"
  | "calc.secondaryAfterExample"
  | "home.afterSituationCards"
  | "guideHub.afterFeatured"
  | "guide.mid";

export type AdFitDevice = "mobile" | "desktop";

export type AdFitSlotSize = {
  width: 320 | 300 | 728;
  height: 100 | 250 | 90;
};

export type AdFitResolvedSlot = AdFitSlotSize & {
  unitId: string;
  device: AdFitDevice;
};

type AdFitUnitConfig = {
  mobile?: AdFitResolvedSlot;
  desktop?: AdFitResolvedSlot;
  desktopCompact?: AdFitResolvedSlot;
};

export const ADFIT_SDK_SRC = "https://t1.kakaocdn.net/kas/static/ba.min.js";
export const ADFIT_MAX_SLOTS_PER_ROUTE = 3;
export const DEFAULT_ADFIT_ALLOWED_HOSTS = ["weddingbudget.co.kr", "www.weddingbudget.co.kr"];
export const ADFIT_CALC_SECONDARY_SLUGS = [
  "wedding-cost",
  "wedding-hall-cost",
  "newlywed-home-budget",
  "studio-dress-makeup-cost",
  "honsu-budget",
  "wedding-gift-budget",
  "honeymoon-budget",
] as const;

const adFitEnabled = process.env.NEXT_PUBLIC_ADFIT_ENABLED === "true";
const adFitCalcSecondaryEnabled = process.env.NEXT_PUBLIC_ADFIT_CALC_SECONDARY_ENABLED === "true";
const allowedHosts = parseAllowedHosts(process.env.NEXT_PUBLIC_ADFIT_ALLOWED_HOSTS);

export const adFitRuntimeConfig = {
  enabled: adFitEnabled,
  calcSecondaryEnabled: adFitCalcSecondaryEnabled,
  allowedHosts,
};

export const adFitUnits: Record<AdFitPlacement, AdFitUnitConfig> = {
  "calc.primaryAfterSummary": {
    mobile: createSlot(process.env.NEXT_PUBLIC_ADFIT_CALC_PRIMARY_M_320X100, "mobile", 320, 100),
    desktop: createSlot(process.env.NEXT_PUBLIC_ADFIT_CALC_PRIMARY_D_728X90, "desktop", 728, 90),
    desktopCompact: createSlot(process.env.NEXT_PUBLIC_ADFIT_CALC_PRIMARY_D_300X250, "desktop", 300, 250),
  },
  "calc.secondaryAfterExample": {
    mobile: createSlot(process.env.NEXT_PUBLIC_ADFIT_CALC_SECONDARY_M_300X250, "mobile", 300, 250),
    desktop: createSlot(process.env.NEXT_PUBLIC_ADFIT_CALC_SECONDARY_D_300X250, "desktop", 300, 250),
  },
  "home.afterSituationCards": {
    mobile: createSlot(process.env.NEXT_PUBLIC_ADFIT_HOME_AFTER_SITUATIONS_M_320X100, "mobile", 320, 100),
    desktop: createSlot(process.env.NEXT_PUBLIC_ADFIT_HOME_AFTER_SITUATIONS_D_728X90, "desktop", 728, 90),
  },
  "guideHub.afterFeatured": {
    mobile: createSlot(process.env.NEXT_PUBLIC_ADFIT_GUIDE_HUB_M_320X100, "mobile", 320, 100),
    desktop: createSlot(process.env.NEXT_PUBLIC_ADFIT_GUIDE_HUB_D_728X90, "desktop", 728, 90),
  },
  "guide.mid": {
    mobile: createSlot(process.env.NEXT_PUBLIC_ADFIT_GUIDE_MID_M_300X250, "mobile", 300, 250),
    desktop: createSlot(process.env.NEXT_PUBLIC_ADFIT_GUIDE_MID_D_300X250, "desktop", 300, 250),
  },
};

export function isAdFitUnitId(value: string | undefined): value is string {
  return Boolean(value && value.startsWith("DAN-") && !value.includes("REPLACE-ME"));
}

export function hasAdFitBuildCandidate(placement: AdFitPlacement) {
  if (!adFitRuntimeConfig.enabled) {
    return false;
  }

  return Object.values(adFitUnits[placement]).some((slot) => isAdFitUnitId(slot?.unitId));
}

export function isAdFitPlacementEnabled(placement: AdFitPlacement) {
  if (!adFitRuntimeConfig.enabled) {
    return false;
  }

  if (placement === "calc.secondaryAfterExample") {
    return adFitRuntimeConfig.calcSecondaryEnabled;
  }

  return true;
}

export function isAdFitHostAllowed(hostname: string) {
  const normalized = hostname.toLowerCase();

  if (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized.endsWith(".onrender.com") ||
    normalized.includes("preview")
  ) {
    return false;
  }

  return adFitRuntimeConfig.allowedHosts.includes(normalized);
}

export function resolveAdFitSlot(placement: AdFitPlacement, viewportWidth: number, containerWidth: number): AdFitResolvedSlot | null {
  if (!isAdFitPlacementEnabled(placement)) {
    return null;
  }

  const units = adFitUnits[placement];
  const isDesktop = viewportWidth >= 768;

  if (!isDesktop) {
    return units.mobile && isAdFitUnitId(units.mobile.unitId) ? units.mobile : null;
  }

  if (units.desktop && isAdFitUnitId(units.desktop.unitId) && containerWidth >= units.desktop.width) {
    return units.desktop;
  }

  return units.desktopCompact && isAdFitUnitId(units.desktopCompact.unitId) ? units.desktopCompact : null;
}

export function getAdFitReservedSize(placement: AdFitPlacement): AdFitSlotSize {
  if (placement === "calc.secondaryAfterExample" || placement === "guide.mid") {
    return { width: 300, height: 250 };
  }

  return { width: 320, height: 100 };
}

function createSlot(
  unitId: string | undefined,
  device: AdFitDevice,
  width: AdFitSlotSize["width"],
  height: AdFitSlotSize["height"],
): AdFitResolvedSlot | undefined {
  return unitId ? { unitId, device, width, height } : undefined;
}

function parseAllowedHosts(value: string | undefined) {
  const hosts = (value || DEFAULT_ADFIT_ALLOWED_HOSTS.join(","))
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return hosts.length ? hosts : DEFAULT_ADFIT_ALLOWED_HOSTS;
}
