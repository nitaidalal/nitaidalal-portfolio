import { useEffect, useRef } from "react";

const CursorSpotlight = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!cursorRef.current || !ringRef.current) return;

      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]"
      />

      {/* Outer crosshair */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 transition-transform duration-100 ease-out"
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-primary/70" />
        <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-primary/70" />
        <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-primary/70" />
        <span className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-primary/70" />
      </div>
    </>
  );
};

export default CursorSpotlight;
