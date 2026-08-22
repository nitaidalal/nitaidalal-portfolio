// "2024-03-15" → "March 2024"
export const formatMonthYear = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

// "2024-03-15" → "Mar 15, 2024"
export const formatFullDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// "2022" + "2026" → "2022 – 2026"
// "2022" + null  → "2022 – Present"
export const formatYearRange = (startYear, endYear) => {
  if (!startYear) return "";
  return `${startYear} – ${endYear ?? "Present"}`;
};

// "2024-03-15" → "2024"
export const formatYear = (date) => {
  if (!date) return "";
  return new Date(date).getFullYear().toString();
};
