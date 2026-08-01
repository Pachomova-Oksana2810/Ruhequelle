import {useEffect, useRef} from "react";

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
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
    return () => observer.disconnect();
  }, []);

  return ref;
}
