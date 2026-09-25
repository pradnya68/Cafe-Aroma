import React, { useEffect, useRef } from 'react';

const StatsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;

    const counters = section.querySelectorAll('.counter');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = (counter) => {
      if (counter.dataset.counted === 'true') return;
      counter.dataset.counted = 'true';

      const target = Number(counter.dataset.target || 0);
      const decimals = counter.dataset.decimal === 'true' ? 1 : 0;
      const suffix = counter.dataset.suffix || '';
      const duration = reducedMotion ? 1 : 1500;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const value = progress === 1 ? target : target * easeProgress;
        counter.textContent = `${value.toFixed(decimals)}${suffix}`;

        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach((c) => counterObserver.observe(c));

    return () => counterObserver.disconnect();
  }, []);

  return (
    <section className="stats-section" aria-label="Café Aroma in numbers" ref={sectionRef}>
      <div className="container stats-grid">
        <div className="stat reveal">
          <span className="stat__number">
            <span className="counter" data-target="10" data-suffix="+">0</span>
          </span>
          <span className="stat__label">Years of experience</span>
        </div>
        <div className="stat reveal reveal--delay-1">
          <span className="stat__number">
            <span className="counter" data-target="25" data-suffix="K+">0</span>
          </span>
          <span className="stat__label">Happy customers</span>
        </div>
        <div className="stat reveal reveal--delay-2">
          <span className="stat__number">
            <span className="counter" data-target="30" data-suffix="+">0</span>
          </span>
          <span className="stat__label">Coffee varieties</span>
        </div>
        <div className="stat reveal reveal--delay-3">
          <span className="stat__number">
            <span className="counter" data-target="4.9" data-decimal="true" data-suffix="★">0</span>
          </span>
          <span className="stat__label">Guest rating</span>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
