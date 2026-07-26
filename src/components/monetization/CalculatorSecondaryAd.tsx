"use client";

import { useEffect, useState } from "react";
import { AdFitSlot } from "@/components/monetization/AdFitSlot";
import { ADFIT_CALC_SECONDARY_SLUGS, adFitRuntimeConfig } from "@/config/adfit";
import type { CalculatorSlug } from "@/types/calculator";

const calculatorResultRenderedEvent = "wedding-budget:calculator-result-rendered";

export function CalculatorSecondaryAd({ calculatorSlug }: { calculatorSlug: CalculatorSlug }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!adFitRuntimeConfig.calcSecondaryEnabled || !ADFIT_CALC_SECONDARY_SLUGS.includes(calculatorSlug as (typeof ADFIT_CALC_SECONDARY_SLUGS)[number])) {
      setActive(false);
      return;
    }

    const storageKey = `weddingbudget:result-rendered:${calculatorSlug}`;
    setActive(window.sessionStorage.getItem(storageKey) === "true");

    function handleResultRendered(event: Event) {
      const detail = (event as CustomEvent<{ slug?: string }>).detail;
      if (detail?.slug === calculatorSlug) {
        setActive(true);
      }
    }

    window.addEventListener(calculatorResultRenderedEvent, handleResultRendered);
    return () => window.removeEventListener(calculatorResultRenderedEvent, handleResultRendered);
  }, [calculatorSlug]);

  if (!active) {
    return null;
  }

  return <AdFitSlot placement="calc.secondaryAfterExample" className="mt-12 mb-12" />;
}
