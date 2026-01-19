import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ReactTyped } from "react-typed";
import { SparklesCore } from "./ui/sparkles";

type IntroPreloaderProps = {
  onComplete: () => void;
  // 3 ảnh “newspaper”
  images: { src: string; alt?: string }[];
  // text
  brand?: string;
  tagline?: string;
  // (optional) chỉ hiện 1 lần / session
  oncePerSessionKey?: string;
};

export const IntroPreloader = ({
  onComplete,
  images,
  brand = "TimeWisely",
  tagline = "Think Different",
  oncePerSessionKey,
}: IntroPreloaderProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const textRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [show, setShow] = useState(true);
  const [typedActive, setTypedActive] = useState(false);
  const prefersReduced = useMemo(
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
    []
  );

  // Sparkles (giữ y như file cũ của bạn) :contentReference[oaicite:1]{index=1}
  const sparkles = useMemo(
    () => (
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={10}
        className="absolute inset-0 z-0"
        particleColor="#ffffff"
      />
    ),
    []
  );

  // optional: chỉ chạy 1 lần mỗi session
  useEffect(() => {
    if (!oncePerSessionKey) return;
    const done = sessionStorage.getItem(oncePerSessionKey) === "1";
    if (done) {
      setShow(false);
      onComplete();
    }
  }, [oncePerSessionKey, onComplete]);

  // lock scroll khi intro chạy
  useEffect(() => {
    if (!show) return;
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  useEffect(() => {
    if (prefersReduced) {
      setShow(false);
      onComplete();
    }
  }, [prefersReduced, onComplete]);

  useLayoutEffect(() => {
    if (!show || prefersReduced) return;

    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const tWrap = textRef.current;
    const imgs = imgsRef.current;

    if (!overlay || !stage || !tWrap || imgs.length < 3) return;

    // reset typed
    setTypedActive(false);

    // tempo subtle
    const DUR = {
      fadeInOverlay: 1.28,
      throw: 2.1,
      settle: 0.4,
      revealText: 0.65,
      hold: 1.2,
      shrink: 0.85,
      fadeOut: 9.38,
    };
    const EASE = {
      fade: "power1.inOut",
      throw: "power2.out",
      settle: "sine.out",
      reveal: "power2.out",
      shrink: "power2.inOut",
    } as const;

    // end positions lấy từ CSS vars trên stage (bạn chỉnh layout bằng CSS)
    const getVarNum = (name: string, fallback: number) => {
      const v = getComputedStyle(stage).getPropertyValue(name).trim();
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : fallback;
    };
    const endFromStagePct = (px: number, py: number) => {
      const r = stage.getBoundingClientRect();
      return {
        x: (px / 100) * r.width - r.width / 2,
        y: (py / 100) * r.height - r.height / 2,
      };
    };

    const endPos = [
      endFromStagePct(getVarNum("--i1x", 28), getVarNum("--i1y", 46)),
      endFromStagePct(getVarNum("--i2x", 52), getVarNum("--i2y", 30)),
      endFromStagePct(getVarNum("--i3x", 73), getVarNum("--i3y", 52)),
    ];

    // start positions “newspaper” từ ngoài stage
    const r = stage.getBoundingClientRect();
    const startPos = [
      { x: -r.width * 0.95, y: -r.height * 0.45 },
      { x: r.width * 0.8, y: -r.height * 0.8 },
      { x: r.width * 0.95, y: r.height * 0.75 },
    ];

    gsap.set(overlay, { opacity: 1 });
    gsap.set(stage, { scale: 1, x: 0, y: 0, opacity: 1 });
    gsap.set(tWrap, { opacity: 0, y: 10, scale: 0.99 });

    imgs.forEach((img, i) => {
      gsap.set(img, {
        x: startPos[i].x,
        y: startPos[i].y,
        rotation: gsap.utils.random(-18, 18),
        scale: 0.92,
        skewX: gsap.utils.random(-6, 6),
        opacity: 0,
      });
    });

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setShow(false);
        if (oncePerSessionKey) sessionStorage.setItem(oncePerSessionKey, "1");
        onComplete();
      },
    });

    tlRef.current = tl;

    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: DUR.fadeInOverlay, ease: EASE.fade }
    );

    const STAG = 0.2;
    imgs.forEach((img, i) => {
      tl.to(img, { opacity: 1, duration: 0.01 }, `throw+=${i * STAG}`);

      tl.to(
        img,
        {
          x: endPos[i].x,
          y: endPos[i].y,
          rotation: gsap.utils.random(-8, 8),
          skewX: 0,
          scale: 1,
          duration: DUR.throw,
          ease: EASE.throw,
        },
        `throw+=${i * STAG}`
      );

      tl.to(
        img,
        {
          x: `+=${gsap.utils.random(-10, 10)}`,
          y: `+=${gsap.utils.random(-8, 8)}`,
          rotation: `+=${gsap.utils.random(-2, 2)}`,
          duration: DUR.settle,
          ease: EASE.settle,
        },
        `throw+=${i * STAG + DUR.throw - 0.1}`
      );
    });

    tl.to(
      tWrap,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: DUR.revealText,
        ease: EASE.reveal,
      },
      "reveal-=0.15"
    );

    // ✅ typed chỉ bắt đầu sau khi text đã reveal
    tl.call(() => setTypedActive(true), [], "reveal+=0.12");

    tl.to({}, { duration: DUR.hold });

    tl.to(
      stage,
      {
        scale: 0.2,
        xPercent: 190,
        yPercent: 190, // góc phải dưới
        duration: DUR.shrink,
        ease: EASE.shrink,
      },
      "shrink"
    );
    tl.to(
      overlay,
      { opacity: 0, duration: DUR.fadeOut, ease: EASE.fade },
      "shrink+=0.18"
    );

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [show, prefersReduced, onComplete, oncePerSessionKey]);

  const skipNow = () => tlRef.current?.progress(1);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-2147483647 grid place-items-center"
      style={{
        // nền khác container rõ ràng
        background: " linear-gradient(180deg, #04060a 0%, #070a10 100%)",
      }}
      onPointerDown={() => {
        // tăng tốc nhẹ nếu user chạm
        if (tlRef.current) tlRef.current.timeScale(1.8);
      }}
    >
      {sparkles}

      <button
        onClick={(e) => {
          e.stopPropagation();
          skipNow();
        }}
        className="fixed right-4 bottom-4 z-2147483648 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-sm text-white backdrop-blur"
      >
        Skip
      </button>

      <div className="w-[min(1400px,96vw)] h-[min(820px,86vh)] grid place-items-center relative z-10">
        <div
          ref={stageRef}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-[0_34px_110px_rgba(0,0,0,.60)]"
          style={{
            // container/panel khác nền
            background: "rgba(17,44,59,.85)",
            border: "1px solid rgba(255,255,255,.12)",
            // layout ảnh (chỉnh nhanh ở đây)

            "--i1x": 28,
            "--i1y": 46,
            "--i2x": 52,
            "--i2y": 30,
            "--i3x": 73,
            "--i3y": 52,
          }}
        >
          {images.slice(0, 3).map((it, idx) => (
            <img
              key={idx}
              ref={(el) => {
                if (el) imgsRef.current[idx] = el;
              }}
              src={it.src}
              alt={it.alt ?? `intro-${idx + 1}`}
              className="absolute left-1/2 top-1/2 w-[clamp(190px,24vw,360px)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_18px_34px_rgba(0,0,0,.35)]"
              draggable={false}
            />
          ))}

          <div
            ref={textRef}
            className="absolute right-6 bottom-6 text-right text-white"
          >
            {typedActive ? (
              <>
                <ReactTyped
                  strings={[brand]}
                  typeSpeed={58}
                  showCursor={false}
                  className="block text-[clamp(30px,3.2vw,54px)] font-extrabold tracking-wide uppercase"
                />
                <ReactTyped
                  strings={[tagline]}
                  typeSpeed={40}
                  startDelay={250}
                  showCursor={false}
                  className="mt-2 block text-[clamp(13px,1.1vw,16px)] tracking-[0.28em] opacity-90"
                />
              </>
            ) : (
              // freeze state: giữ layout nhưng không gõ
              <div className="opacity-0 select-none">
                <div className="text-[clamp(30px,3.2vw,54px)] font-extrabold tracking-wide uppercase">
                  {brand}
                </div>
                <div className="mt-2 text-[clamp(13px,1.1vw,16px)] tracking-[0.28em] opacity-90">
                  {tagline}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};