import { motion as Motion } from "framer-motion";

const PageTransition = ({ children }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </Motion.div>
);

export default PageTransition;
