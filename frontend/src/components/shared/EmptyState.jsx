import { motion as Motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  message = "Content will appear here once added.",
  action,
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center justify-center
                 py-16 px-4 gap-4 text-center"
    >
      {Icon && (
        <div
          className="w-14 h-14 rounded-full bg-accent flex
                        items-center justify-center"
        >
          <Icon className="text-accent-foreground text-2xl" />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-foreground font-medium">{title}</p>
        <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground
                     text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </Motion.div>
  );
};

export default EmptyState;
