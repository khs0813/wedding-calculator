"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (options: {
        id: number;
        template: string;
        trackingCode: string;
        width: string;
        height: string;
        tsource: string;
        container?: HTMLElement | null;
      }) => void;
    };
  }
}

const COUPANG_SCRIPT_SRC = "https://ads-partners.coupang.com/g.js";
let coupangScriptPromise: Promise<void> | null = null;

function loadCoupangScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.PartnersCoupang) {
    return Promise.resolve();
  }

  if (coupangScriptPromise) {
    return coupangScriptPromise;
  }

  coupangScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${COUPANG_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      if (window.PartnersCoupang) {
        resolve();
      } else {
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", (e) => reject(e));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = COUPANG_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return coupangScriptPromise;
}

type CoupangBannerProps = {
  className?: string;
};

export function CoupangBanner({ className = "" }: CoupangBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // 테스트 환경 또는 웹드라이버 환경에서는 스크립트 실행 생략
    if (process.env.NODE_ENV === "test" || window.navigator.webdriver) {
      return;
    }

    if (initializedRef.current) {
      return;
    }

    let isMounted = true;
    const container = containerRef.current;

    loadCoupangScript()
      .then(() => {
        if (!isMounted || !container || initializedRef.current) {
          return;
        }

        if (window.PartnersCoupang?.G) {
          try {
            new window.PartnersCoupang.G({
              id: 1031229,
              template: "carousel",
              trackingCode: "AF4791224",
              width: "100%",
              height: "140",
              tsource: "",
              container,
            });
            initializedRef.current = true;
          } catch (error) {
            console.error("Failed to initialize Coupang Partners banner:", error);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to load Coupang script:", error);
      });

    return () => {
      isMounted = false;
      if (container) {
        container.innerHTML = "";
      }
      initializedRef.current = false;
    };
  }, []);

  return (
    <aside
      className={`coupang-banner-slot no-print my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}
      aria-label="쿠팡 파트너스 추천 상품"
    >
      <div className="w-full max-w-[680px] overflow-hidden rounded-xl bg-card p-2 shadow-sm border border-border">
        <div
          ref={containerRef}
          className="coupang-banner-container mx-auto flex min-h-[140px] w-full max-w-full items-center justify-center overflow-hidden [&>ins]:max-w-full [&_iframe]:max-w-full"
        />
        <p className="mt-1.5 text-center text-[11px] leading-relaxed text-muted-foreground">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </aside>
  );
}
