import { useEffect, useRef } from "react";

const CursorSpotlight = () => {
  const spotRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!spotRef.current) return;
      spotRef.current.style.left = `${e.clientX}px`;
      spotRef.current.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed z-[100] 
                 -translate-x-1/2 -translate-y-1/2
                 w-96 h-96 rounded-full"
      style={{
        background:
          "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        opacity: 0.35,
        transition: "left 0.08s ease, top 0.08s ease",
      }}
    />
  );
};

export default CursorSpotlight;
