import { createContext, useEffect, useState } from "react";
import {
  DEFAULT_COLOR_THEME,
  DEFAULT_APPEARANCE,
  STORAGE_KEY,
} from "../config/themes";

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const [color, appearance] = saved.split("-");
    if (color && appearance) return { color, appearance };
  }
  
  return { color: DEFAULT_COLOR_THEME, appearance: DEFAULT_APPEARANCE };
};

export const ThemeProvider = ({ children }) => {
  const [colorTheme, setColorTheme] = useState(() => getInitialTheme().color);
  const [appearance, setAppearance] = useState(
    () => getInitialTheme().appearance,
  );

  // whenever either changes → update data-theme + localStorage
  useEffect(() => {
    const dataTheme = `${colorTheme}-${appearance}`;
    document.documentElement.setAttribute("data-theme", dataTheme);
    localStorage.setItem(STORAGE_KEY, dataTheme);
  }, [colorTheme, appearance]);

  const setTheme = (color, mode) => {
    if (color) setColorTheme(color);
    if (mode) setAppearance(mode);
  };

  return (
    <ThemeContext.Provider
      value={{ colorTheme, appearance, setColorTheme, setAppearance, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
