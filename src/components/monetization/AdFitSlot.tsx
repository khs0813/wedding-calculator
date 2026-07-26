"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADFIT_MAX_SLOTS_PER_ROUTE,
  ADFIT_SDK_SRC,
  type AdFitPlacement,
  type AdFitResolvedSlot,
  getAdFitReservedSize,
  hasAdFitBuildCandidate,
  isAdFitHostAllowed,
  resolveAdFitSlot,
} from "@/config/adfit";

declare global {
  interface Window {
    __weddingBudgetAdFitLoaded?: boolean;
    __weddingBudgetAdFitLoading?: boolean;
    __weddingBudgetAdFitRouteCounts?: Record<string, number>;
    __weddingBudgetAdFitRequestedPlacements?: string[];
    __weddingBudgetAdFitWarned?: string[];
  }
}

type AdFitSlotProps = {
  placement: AdFitPlacement;
  active?: boolean;
  className?: string;
};

export function AdFitSlot({ placement, active = true, className = "" }: AdFitSlotProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<AdFitResolvedSlot | null>(null);
  const [shouldReserve, setShouldReserve] = useState(active && hasAdFitBuildCandidate(placement));
  const reservedSize = slot || getAdFitReservedSize(placement);
  const slotFormat = getSlotFormat(placement, slot);

  useEffect(() => {
    if (!active || !hasAdFitBuildCandidate(placement)) {
      setSlot(null);
      setShouldReserve(false);
      return;
    }

    if (process.env.NODE_ENV === "test" || window.navigator.webdriver || !isAdFitHostAllowed(window.location.hostname)) {
      setSlot(null);
      setShouldReserve(false);
      return;
    }

    const routeKey = `${window.location.pathname}:${placement}`;
    const requested = getRequestedPlacements();
    if (requested.includes(routeKey)) {
      setSlot(null);
      setShouldReserve(false);
      return;
    }

    const routeCounts = getRouteCounts();
    const route = window.location.pathname;
    if ((routeCounts[route] || 0) >= ADFIT_MAX_SLOTS_PER_ROUTE) {
      warnOnce(`route-limit:${route}`, `AdFit route slot limit reached for ${route}`);
      setSlot(null);
      setShouldReserve(false);
      return;
    }

    const measuredWidth = wrapperRef.current?.getBoundingClientRect().width || window.innerWidth;
    const resolved = resolveAdFitSlot(placement, window.innerWidth, measuredWidth);
    if (!resolved) {
      warnOnce(`missing-unit:${placement}`, `AdFit unit is missing for ${placement}`);
      setSlot(null);
      setShouldReserve(false);
      return;
    }

    requested.push(routeKey);
    routeCounts[route] = (routeCounts[route] || 0) + 1;
    setShouldReserve(true);
    setSlot(resolved);
  }, [active, placement]);

  useEffect(() => {
    if (!active || !slot) {
      return;
    }

    const adElement = wrapperRef.current?.querySelector("ins.kakao_ad_area");
    if (!adElement) {
      return;
    }

    const frame = window.requestAnimationFrame(loadAdFitSdkOnce);
    return () => window.cancelAnimationFrame(frame);
  }, [active, slot]);

  if (!active || !shouldReserve) {
    return null;
  }

  return (
    <aside
      ref={wrapperRef}
      className={`adfit-slot no-print ${className}`}
      data-adfit-placement={placement}
      data-adfit-size={`${reservedSize.width}x${reservedSize.height}`}
      data-adfit-format={slotFormat}
      aria-label="광고"
    >
      <div className="w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] sm:ml-0 sm:mr-0 sm:w-full">
        <p className="mb-2 text-center text-[11px] font-medium leading-none text-muted-foreground">광고</p>
        <div className="adfit-slot__inner mx-auto flex max-w-full flex-col items-center justify-start overflow-hidden">
          {slot ? (
            <ins
              className="kakao_ad_area"
              style={{ display: "none", width: "100%" }}
              data-ad-unit={slot.unitId}
              data-ad-width={String(slot.width)}
              data-ad-height={String(slot.height)}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function getSlotFormat(placement: AdFitPlacement, slot: AdFitResolvedSlot | null) {
  if (slot?.width === 300 && slot.height === 250) {
    return "rectangle";
  }

  if (placement === "calc.secondaryAfterExample" || placement === "guide.mid") {
    return "rectangle";
  }

  return "horizontal";
}

function loadAdFitSdkOnce() {
  if (window.__weddingBudgetAdFitLoaded || window.__weddingBudgetAdFitLoading) {
    return;
  }

  if (document.querySelector(`script[src="${ADFIT_SDK_SRC}"]`)) {
    window.__weddingBudgetAdFitLoaded = true;
    return;
  }

  window.__weddingBudgetAdFitLoading = true;
  const script = document.createElement("script");
  script.async = true;
  script.type = "text/javascript";
  script.charset = "utf-8";
  script.src = ADFIT_SDK_SRC;
  script.onload = () => {
    window.__weddingBudgetAdFitLoaded = true;
    window.__weddingBudgetAdFitLoading = false;
  };
  script.onerror = () => {
    window.__weddingBudgetAdFitLoading = false;
  };
  document.body.appendChild(script);
}

function getRouteCounts() {
  window.__weddingBudgetAdFitRouteCounts ||= {};
  return window.__weddingBudgetAdFitRouteCounts;
}

function getRequestedPlacements() {
  window.__weddingBudgetAdFitRequestedPlacements ||= [];
  return window.__weddingBudgetAdFitRequestedPlacements;
}

function warnOnce(key: string, message: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  window.__weddingBudgetAdFitWarned ||= [];
  if (window.__weddingBudgetAdFitWarned.includes(key)) {
    return;
  }

  window.__weddingBudgetAdFitWarned.push(key);
  console.warn(message);
}
