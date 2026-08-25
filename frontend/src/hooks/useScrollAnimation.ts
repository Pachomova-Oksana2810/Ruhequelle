import {useCallback, useRef} from "react";

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback((node: T | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      },
      {threshold: 0.1, rootMargin: "0px 0px -40px 0px"}
    );

    observer.observe(node);
    observerRef.current = observer;
  }, []);
}
