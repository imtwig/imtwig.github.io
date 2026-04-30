import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

const AnimatedStat = ({ value, suffix = "", label, duration = 2 }: AnimatedStatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = (now - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      // ease in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
      className="text-center"
    >
      <span className="text-4xl md:text-5xl font-bold font-serif text-accent">
        {count}{suffix}
      </span>
      <p className="text-muted-foreground mt-2 text-sm">{label}</p>
    </motion.div>
  );
};

export default AnimatedStat;
