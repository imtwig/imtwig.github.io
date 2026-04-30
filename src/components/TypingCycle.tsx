import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fullText = "DERRICK ZI GEN, NG";
// DEZIGN: D(0) E(1) Z(8) I(9) G(11) N(16)
const tealIndices = new Set([0, 1, 8, 9, 11, 16]);

const TYPING_SPEED = 180;
const DELETING_SPEED = 100;
const TRAVEL_SPEED = 60;
const CURSOR_TRAVEL_SPEED = 120;
const PAUSE_EXPANDED = 4000;
const PAUSE_COLLAPSED = 2500;

const chars = fullText.split("").map((char, i) => ({
  char,
  teal: tealIndices.has(i),
}));

const tealStops = [...Array.from(tealIndices)].sort((a, b) => a - b);
const cursorStops = [...tealStops, chars.length]; // [0,1,8,9,11,16,18]

// First non-teal position (where typing starts from)
const firstNonTealPos = chars.findIndex((c) => !c.teal); // 2

const Cursor = () => (
  <motion.span
    className="inline-block w-[1.5px] h-[1.2em] bg-accent align-middle translate-y-[-0.05em]"
    animate={{ opacity: [1, 0] }}
    transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
  />
);

type Phase =
  | "typing"
  | "deleting"
  | "paused-expanded"
  | "paused-collapsed"
  | "travel-to-end"
  | "travel-to-start"
  | "waiting";

const TypingCycle = ({ startDelay = 0 }: { startDelay?: number }) => {
  const [visible, setVisible] = useState<boolean[]>(chars.map((c) => c.teal));
  const [cursorPos, setCursorPos] = useState(chars.length); // start at end of DEZIGN
  const [phase, setPhase] = useState<Phase>(startDelay === 0 ? "travel-to-start" : "waiting");
  const [started, setStarted] = useState(startDelay === 0);

  const allNonTealHidden = visible.every((v, i) => chars[i].teal ? true : !v);

  // Initial delay, then travel cursor back to typing position
  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      setPhase("travel-to-start");
    }, startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started || phase === "waiting") return;

    if (phase === "paused-expanded") {
      const t = setTimeout(() => setPhase("deleting"), PAUSE_EXPANDED);
      return () => clearTimeout(t);
    }

    if (phase === "paused-collapsed") {
      const t = setTimeout(() => setPhase("travel-to-start"), PAUSE_COLLAPSED);
      return () => clearTimeout(t);
    }

    if (phase === "typing") {
      if (cursorPos >= chars.length) {
        setPhase("paused-expanded");
        return;
      }
      const speed = chars[cursorPos]?.teal ? TRAVEL_SPEED : TYPING_SPEED;
      const t = setTimeout(() => {
        if (!chars[cursorPos].teal) {
          setVisible((prev) => {
            const next = [...prev];
            next[cursorPos] = true;
            return next;
          });
        }
        setCursorPos((p) => p + 1);
      }, speed);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      // Stop when all non-teal chars are hidden
      if (allNonTealHidden) {
        setPhase("travel-to-end");
        return;
      }
      if (cursorPos <= 0) {
        setPhase("travel-to-end");
        return;
      }
      const speed = chars[cursorPos - 1]?.teal ? TRAVEL_SPEED : DELETING_SPEED;
      const t = setTimeout(() => {
        const i = cursorPos - 1;
        if (!chars[i].teal) {
          setVisible((prev) => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
        }
        setCursorPos(i);
      }, speed);
      return () => clearTimeout(t);
    }

    if (phase === "travel-to-end") {
      if (cursorPos >= chars.length) {
        setPhase("paused-collapsed");
        return;
      }
      const nextStop = cursorStops.find((s) => s > cursorPos);
      if (nextStop === undefined) {
        setCursorPos(chars.length);
        setPhase("paused-collapsed");
        return;
      }
      const t = setTimeout(() => {
        setCursorPos(nextStop);
      }, CURSOR_TRAVEL_SPEED);
      return () => clearTimeout(t);
    }

    if (phase === "travel-to-start") {
      // Travel back to firstNonTealPos (between E and Z)
      if (cursorPos <= firstNonTealPos) {
        setCursorPos(firstNonTealPos);
        setPhase("typing");
        return;
      }
      const prevStop = [...cursorStops].reverse().find((s) => s < cursorPos);
      const target = prevStop !== undefined ? Math.max(prevStop, firstNonTealPos) : firstNonTealPos;
      const t = setTimeout(() => {
        setCursorPos(target);
      }, CURSOR_TRAVEL_SPEED);
      return () => clearTimeout(t);
    }
  }, [phase, cursorPos, visible, allNonTealHidden]);

  if (!started) return null;

  return (
    <span className="inline break-words" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {chars.map((c, i) => (
        <span key={i}>
          {i === cursorPos && <Cursor />}
          {visible[i] && (
            <span className="text-accent">{c.char}</span>
          )}
        </span>
      ))}
      {cursorPos === chars.length && <Cursor />}
    </span>
  );
};

export default TypingCycle;
