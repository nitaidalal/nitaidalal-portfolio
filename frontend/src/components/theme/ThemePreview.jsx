import { motion } from "framer-motion";
import { Check } from "lucide-react";

// Mini visual preview card — shows bg, card surface, primary dot, accent dot
const ThemePreview = ({ theme, appearance, isActive, onClick }) => {
  const colors = theme.preview[appearance];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col gap-2 rounded-xl p-3 border-2 transition-all duration-200 cursor-pointer w-full text-left"
      style={{
        backgroundColor: colors.background,
        borderColor: isActive ? colors.primary : "transparent",
        boxShadow: isActive
          ? `0 0 0 3px ${colors.primary}30`
          : "0 1px 4px rgba(0,0,0,0.08)",
      }}
      aria-label={`Select ${theme.label} theme`}
      aria-pressed={isActive}
    >
      {/* Active checkmark */}
      {isActive && (
        <span
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Check size={11} color="#fff" strokeWidth={3} />
        </span>
      )}

      {/* Mini card surface preview */}
      <div
        className="w-full h-8 rounded-md"
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.accent}`,
        }}
      />

      {/* Color dots: primary + accent */}
      <div className="flex gap-1.5 items-center">
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors.primary }}
        />
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors.accent }}
        />
        <span
          className="text-xs font-medium ml-1 truncate"
          style={{ color: colors.primary }}
        >
          {theme.emoji} {theme.label}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-xs leading-tight"
        style={{ color: appearance === "dark" ? "#8888a0" : "#71717a" }}
      >
        {theme.description}
      </p>
    </motion.button>
  );
};

export default ThemePreview;
