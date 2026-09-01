import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { HiArrowLeft } from "react-icons/hi";

const NotFound = () => {
  return (
    <div className="min-h-screen  bg-background flex items-center justify-center px-4">
      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Animated 404 Illustration */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="w-72 h-72 sm:w-80 sm:h-80"
        >
          <DotLottieReact
            src="https://lottie.host/7da90a03-50ed-4448-856d-073e2d5cf1b7/ozrF3lTQj3.lottie"
            loop
            autoplay
          />
        </Motion.div>

        {/* Error Message */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-6xl font-extrabold text-foreground">404</h1>

          <p className="text-muted-foreground text-lg">
            This page doesn't exist.
          </p>
        </Motion.div>

        {/* Back Button */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
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
      </Motion.div>
    </div>
  );
};

export default NotFound;
