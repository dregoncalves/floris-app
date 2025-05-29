import { useEffect, useState } from "react";

export function useSmoothCountUp(to: number, duration = 1200, decimals = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf: number;
    let start = 0;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (to - start) * progress;
      if (progress < 1) {
        setCount(Number(value.toFixed(decimals)));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(Number(to.toFixed(decimals))); // Garante valor final exato
      }
    }

    setCount(0);
    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [to, duration, decimals]);

  return count;
}
