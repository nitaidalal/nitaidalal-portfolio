export const COLOR_THEMES = [
  {
    id: "forest",
    label: "Forest",
    emoji: "🌲",
    description: "Calm & natural",
    preview: {
      light: {
        background: "#f4f7f4",
        card: "#ffffff",
        primary: "#3a7d5c",
        accent: "#d4ede1",
      },
      dark: {
        background: "#0e1812",
        card: "#1e1e24",
        primary: "#4fa876",
        accent: "#1a3327",
      },
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    emoji: "🌊",
    description: "Clean & technical",
    preview: {
      light: {
        background: "#f0f4fa",
        card: "#ffffff",
        primary: "#2563a8",
        accent: "#dbeafe",
      },
      dark: {
        background: "#0c1420",
        card: "#1e1e24",
        primary: "#4a90d9",
        accent: "#162340",
      },
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    emoji: "🌅",
    description: "Warm & energetic",
    preview: {
      light: {
        background: "#fdf6ee",
        card: "#ffffff",
        primary: "#c96a20",
        accent: "#fde8d0",
      },
      dark: {
        background: "#1a1008",
        card: "#1e1e24",
        primary: "#e8874a",
        accent: "#2e1a08",
      },
    },
  },
  {
    id: "lavender",
    label: "Lavender",
    emoji: "💜",
    description: "Creative & soft",
    preview: {
      light: {
        background: "#f5f3fb",
        card: "#ffffff",
        primary: "#6d44c0",
        accent: "#ede8f8",
      },
      dark: {
        background: "#120e1e",
        card: "#1e1e24",
        primary: "#9b72f0",
        accent: "#1e1530",
      },
    },
  },
  {
    id: "rose",
    label: "Rose",
    emoji: "🌸",
    description: "Elegant & friendly",
    preview: {
      light: {
        background: "#fdf2f5",
        card: "#ffffff",
        primary: "#b84868",
        accent: "#fce4ec",
      },
      dark: {
        background: "#1a0c10",
        card: "#1e1e24",
        primary: "#e07090",
        accent: "#2e1020",
      },
    },
  },
];

export const APPEARANCES = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
];

export const DEFAULT_COLOR_THEME = "ocean";
export const DEFAULT_APPEARANCE = "light";
export const STORAGE_KEY = "portfolio-theme";
