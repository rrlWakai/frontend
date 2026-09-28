import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 5, suffix: "+", label: "Projects delivered" },
  { value: 2, suffix: "+", label: "Hospitality clients" },
  { value: 2, suffix: "+", label: "Years building" },
  { value: 12, suffix: "", label: "Certifications" },
] as const;

function getInitialCounts() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return STATS.map(({ value }) => (reduceMotion ? value : 0));
}

function StatsStrip() {
  const statsRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState<number[]>(getInitialCounts);

  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let hasAnimated = false;
    let frameId = 0;
    let startedAt = 0;

    const finishImmediately = () => {
      hasAnimated = true;
      cancelAnimationFrame(frameId);
      setCounts(STATS.map(({ value }) => value));
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;
        if (motionPreference.matches) {
          finishImmediately();
          return;
        }

        hasAnimated = true;
        const animate = (timestamp: number) => {
          if (!startedAt) startedAt = timestamp;
          const progress = Math.min((timestamp - startedAt) / 1100, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          setCounts(
            STATS.map(({ value }) => Math.round(value * easedProgress)),
          );

          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          } else {
            observer.disconnect();
          }
        };

        frameId = requestAnimationFrame(animate);
      },
      { threshold: 0.4 },
    );

    const handleMotionChange = () => {
      if (motionPreference.matches && !hasAnimated) finishImmediately();
    };

    motionPreference.addEventListener("change", handleMotionChange);
    observer.observe(element);

    return () => {
      motionPreference.removeEventListener("change", handleMotionChange);
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section
      ref={statsRef}
      aria-label="Portfolio statistics"
      className="grid grid-cols-2 border-y border-line md:grid-cols-4"
    >
      {STATS.map((stat, index) => (
        <div
          className={`min-w-0 py-5 pr-[22px] md:py-6 ${
            index % 2 === 1 ? "border-l border-line pl-[22px]" : "pl-0"
          } ${index > 0 ? "md:border-l md:border-line md:pl-[22px]" : ""} ${
            index >= 2 ? "border-t border-line md:border-t-0" : ""
          }`}
          key={stat.label}
        >
          <div className="flex items-baseline gap-1 font-serif text-[32px] leading-none tabular-nums text-ink md:text-[38px]">
            <span>{counts[index]}</span>
            {stat.suffix && (
              <span className="font-serif text-[18px] text-gray-light md:text-[22px]">
                {stat.suffix}
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-light">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
}

export default StatsStrip;
