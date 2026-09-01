import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TbError404 } from "react-icons/tb";
import { HiArrowLeft } from "react-icons/hi";

const NotFound = () => (
  <div
    className="min-h-screen bg-background flex items-center
                  justify-center px-4"
  >
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <div
        className="w-24 h-24 rounded-2xl bg-accent flex items-center
                      justify-center"
      >
        <TbError404 className="text-primary text-5xl" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-extrabold text-foreground">404</h1>
        <p className="text-muted-foreground text-lg">
          This page doesn't exist.
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl
                   bg-primary text-primary-foreground font-semibold
                   text-sm hover:opacity-90 transition-opacity"
      >
        <HiArrowLeft />
        Back to Home
      </Link>
    </Motion.div>
  </div>
);

export default NotFound;
