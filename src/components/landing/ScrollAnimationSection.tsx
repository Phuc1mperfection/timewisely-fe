import React, { useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import backgroundImg from "@/assets/images/productive-background.jpg";

interface ScrollAnimationSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  containerAnimation: gsap.core.Tween | null;
}

const ScrollAnimationSection: React.FC<ScrollAnimationSectionProps> = ({
  title,
  subtitle,
  backgroundImage = backgroundImg,
  containerAnimation,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const words = useMemo(() => title.trim().split(/\s+/), [title]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const bg = bgRef.current;
    const tween = containerAnimation;

    if (!section || !bg || !tween) return;

    const lines = section.querySelectorAll<HTMLElement>(".sa-line");
    if (!lines.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "left center",
          end: "right center",
          scrub: 1,
          containerAnimation: tween,
        },
      });

      // TEXT: chạy DỌC XUỐNG + mỗi từ 1 dòng + stagger nhẹ
      tl.fromTo(
        lines,
        { yPercent: -120, autoAlpha: 0 },
        {
          yPercent: 0, // xuống dưới
          autoAlpha: 1,
          ease: "none",
          stagger: 0.08, // mỗi từ lệch nhau 1 chút
        },
        0
      );
      tl.to(lines, { yPercent: 0 }, 0.35);
      tl.to(
        lines,
        {
          yPercent: 120,
          autoAlpha: 0,
          stagger: 0.06,
          ease: "none",
        },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, [containerAnimation, words.length]);
  return (
    <section
      ref={sectionRef}
      className="relative h-full w-full overflow-hidden"
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Background"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Text block */}
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="px-6">
          {/* Title: mỗi từ 1 dòng */}
          <div className=" font-extrabold uppercase text-white text-[clamp(32px,6vw,140px)] ">
            {words.map((w, i) => (
              <div key={i} className="sa-line whitespace-nowrap">
                {w}
              </div>
            ))}
          </div>

          {subtitle ? (
            <div className="mt-6 text-white/80 text-[clamp(14px,1.4vw,20px)] max-w-[70ch]">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ScrollAnimationSection;
