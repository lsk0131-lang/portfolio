"use client";

import Script from "next/script";
import type { CSSProperties } from "react";

// dotlottie-wc 는 커스텀 엘리먼트라 JSX 타입에 직접 등록한다.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-wc": {
        src?: string;
        autoplay?: boolean;
        loop?: boolean;
        style?: CSSProperties;
      };
    }
  }
}

export default function HeroLottie() {
  return (
    <div className="hero__lottie" aria-hidden="true">
      <Script
        src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.14/dist/dotlottie-wc.js"
        type="module"
        strategy="afterInteractive"
      />
      <dotlottie-wc
        src="https://lottie.host/67ec19af-deff-4bb1-9fb3-e6d506a9668a/Ky3Xzf1nVg.lottie"
        autoplay
        loop
      />
    </div>
  );
}
