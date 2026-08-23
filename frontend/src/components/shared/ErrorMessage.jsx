import { motion as Motion } from "framer-motion";
import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center justify-center
                 py-16 px-4 gap-4 text-center"
    >
      <div
        className="w-14 h-14 rounded-full bg-destructive/10 flex
                      items-center justify-center"
      >
        <MdErrorOutline className="text-destructive text-2xl" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-foreground font-medium">Oops!</p>
        <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground
                     text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      )}
    </Motion.div>
  );
};

export default ErrorMessage;
