import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";


export interface TimelineItem {
  id: number;
  year: string;
  title: string;
  company: string;
  duration: string;
  description: string[];
  icon: React.ReactNode;
  highlight?: boolean;
}

const easeInOut = [0.42, 0, 0.58, 1] as [number, number, number, number];

const TimelineCard = ({ item, index }: { item: TimelineItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -80 : 80, 0, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1]);
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -8 : 8, 0, 0]
  );

  // Node animations
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale, rotateY, perspective: 800 }}
      className={`flex items-center gap-8 ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content Card */}
      <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
        <motion.div
          className="p-6 rounded-2xl border bg-card border-border hover:border-accent/50"
          whileHover={{
            y: -6,
            scale: 1.02,
            boxShadow: "0 20px 40px -12px hsl(var(--accent) / 0.15)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="text-sm font-medium text-accent">{item.duration}</span>
          <h3 className="text-xl font-semibold text-foreground mt-1 font-serif">{item.title}</h3>
          <p className="text-muted-foreground font-medium">{item.company}</p>
          <ul className={`mt-4 space-y-2 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
            {item.description.map((desc, i) => (
              <motion.li
                key={i}
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, x: index % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: easeInOut }}
              >
                {desc}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Timeline Node */}
      <div className="relative flex flex-col items-center">
        <motion.div
          style={{ opacity: nodeOpacity }}
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center bg-secondary text-foreground cursor-pointer"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {item.icon}
          <span className="text-[9px] font-bold leading-none mt-0.5">{item.year}</span>
        </motion.div>
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

export default TimelineCard;
