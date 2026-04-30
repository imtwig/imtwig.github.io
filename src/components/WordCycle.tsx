import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const defaultWords = [
  { word: "Linguist", article: "a" },
  { word: "Engineer", article: "an" },
  { word: "Artist", article: "an" },
  { word: "Doctor", article: "a" },
  { word: "Psychologist", article: "a" },
  { word: "Economist", article: "an" },
  { word: "Statistician", article: "a" },
  { word: "Fortune-Teller", article: "a" },
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 60;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

const getCommonPrefix = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
};

type WordCycleProps = {
  prefix?: string;
  words?: { word: string; article: string }[];
};

const WordCycle = ({ prefix = "", words }: WordCycleProps) => {
  const wordList = words && words.length > 0 ? words : defaultWords;
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState(prefix);
  const [phase, setPhase] = useState<"typing" | "paused" | "deleting" | "next">("typing");

  useEffect(() => {
    setDisplayed(prefix);
    setPhase("typing");
  }, [prefix]);

  const currentItem = wordList[wordIndex % wordList.length];
  const nextItem = wordList[(wordIndex + 1) % wordList.length];

  const fullText = `${prefix}${currentItem.article} ${currentItem.word}`;
  const nextFullText = `${prefix}${nextItem.article} ${nextItem.word}`;
  const commonPrefix = getCommonPrefix(fullText, nextFullText);

  const prefixLen = prefix.length;
  const articleLen = currentItem.article.length;
  const wordStart = prefixLen + articleLen + 1;

  useEffect(() => {
    if (phase === "typing") {
      if (displayed.length < fullText.length) {
        const t = setTimeout(() => setDisplayed(fullText.slice(0, displayed.length + 1)), TYPING_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("deleting"), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (displayed.length > commonPrefix.length) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETING_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("next"), PAUSE_AFTER_DELETE);
      return () => clearTimeout(t);
    }

    if (phase === "next") {
      setWordIndex((i) => (i + 1) % wordList.length);
      setPhase("typing");
    }
  }, [phase, displayed, fullText, commonPrefix, wordList.length]);

  return (
    <span className="inline">
      {(() => {
        if (displayed.length <= wordStart) return <span>{displayed}</span>;
        return (
          <>
            <span>{displayed.slice(0, wordStart)}</span>
            <span className="text-accent font-semibold">{displayed.slice(wordStart)}</span>
          </>
        );
      })()}
      <motion.span
        className="inline-block w-[1.5px] h-[0.9em] bg-accent ml-[1px] align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
      />
    </span>
  );
};

export default WordCycle;
