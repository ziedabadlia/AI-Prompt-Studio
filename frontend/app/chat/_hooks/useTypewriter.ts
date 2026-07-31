import { useState, useEffect, useRef } from "react";

/**
 * Animates `text` character-by-character whenever the value changes.
 * On the first render the full text is shown immediately (no animation).
 */
export function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState(text);
  const [isTyping, setIsTyping] = useState(false);
  const prevText = useRef(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Skip animation on mount — only animate changes.
    if (text === prevText.current) return;
    prevText.current = text;

    // Clear any in-progress animation.
    if (timerRef.current) clearInterval(timerRef.current);

    setIsTyping(true);
    let i = 0;
    setDisplayed("");

    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  return { displayed, isTyping };
}
