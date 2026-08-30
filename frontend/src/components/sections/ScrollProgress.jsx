import { motion as Motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <Motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary
                   origin-left z-[100]"
    />
  );
};

export default ScrollProgress;