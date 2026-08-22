import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { COLOR_THEMES, APPEARANCES } from "../../config/themes";
import ThemePreview from "./ThemePreview";

// Shared inner content — used in both Popover and Sheet
export const ThemeSwitcherContent = () => {
  const { colorTheme, appearance, setColorTheme, setAppearance } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Appearance toggle ───────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Appearance
        </p>
        <div className="grid grid-cols-2 gap-2">
          {APPEARANCES.map((mode) => {
            const isActive = appearance === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setAppearance(mode.id)}
                whileTap={{ scale: 0.96 }}
                className="flex items-center justify-center gap-2 py-2 rounded-lg
                           text-sm font-medium border transition-all duration-200"
                style={{
                  backgroundColor: isActive
                    ? "var(--primary)"
                    : "var(--secondary)",
                  color: isActive
                    ? "var(--primary-foreground)"
                    : "var(--foreground-soft)",
                  borderColor: isActive ? "var(--primary)" : "var(--border)",
                }}
                aria-pressed={isActive}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* ─── Color theme grid ────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Color Theme
        </p>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_THEMES.map((theme) => (
            <ThemePreview
              key={theme.id}
              theme={theme}
              appearance={appearance}
              isActive={colorTheme === theme.id}
              onClick={() => setColorTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* ─── Active combo badge ──────────────────── */}
      <div className="flex items-center justify-center">
        <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted border border-border">
          {COLOR_THEMES.find((t) => t.id === colorTheme)?.emoji}{" "}
          {COLOR_THEMES.find((t) => t.id === colorTheme)?.label} ·{" "}
          {appearance === "light" ? "☀️ Light" : "🌙 Dark"}
        </span>
      </div>
    </div>
  );
};

// Main export — Popover on desktop, inline in Sheet on mobile
const ThemeSwitcher = ({ inSheet = false }) => {
  if (inSheet) {
    return <ThemeSwitcherContent />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                     bg-accent text-accent-foreground border border-border
                     hover:bg-primary hover:text-primary-foreground
                     transition-colors duration-200"
          aria-label="Open theme switcher"
        >
          <Palette size={15} />
          <span className="hidden sm:inline">Theme</span>
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-4 rounded-2xl border border-border bg-card shadow-xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
        >
          <ThemeSwitcherContent />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSwitcher;
