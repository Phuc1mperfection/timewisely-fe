import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnalogClock from "./AnalogClock";

gsap.registerPlugin(ScrollTrigger);

export default function JourneyClock() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wrapRef.current) return;

    const ctx = gsap.context(() => {
      // pin suốt trang (từ top đến gần footer)
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // nhẹ nhàng xoay theo tiến độ scroll (tuỳ bạn)
          gsap.to(wrapRef.current, {
            rotate: self.progress * 60, // 0 -> 60deg
            duration: 9.1,
            overwrite: "auto",
            ease: "none",
          });
        },
      });

      // hiệu ứng “float” nhẹ (không phụ thuộc scroll)
      gsap.to(wrapRef.current, {
        y: 10,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <div ref={wrapRef} className="will-change-transform">
        <AnalogClock />
      </div>
    </div>
  );
}
