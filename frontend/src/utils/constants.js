export const API_ROUTES = {
  // auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  CHANGE_PASSWORD: "/auth/change-password",

  // public
  PROFILE: "/profile",
  PROJECTS: "/projects",
  FEATURED_PROJECTS: "/projects/featured",
  SKILLS: "/skills",
  EDUCATION: "/education",
  CERTIFICATIONS: "/certifications",
  ACHIEVEMENTS: "/achievements",
  CONTACT: "/messages",

  // admin
  ADMIN_PROJECTS: "/projects",
  ADMIN_SKILLS: "/skills",
  ADMIN_EDUCATION: "/education",
  ADMIN_CERTIFICATIONS: "/certifications",
  ADMIN_ACHIEVEMENTS: "/achievements",
  ADMIN_PROFILE: "/profile",
  ADMIN_MESSAGES: "/messages",
};

export const APP_ROUTES = {
  HOME: "/",
  ALL_PROJECTS: "/projects",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PROFILE: "/admin/profile",
  ADMIN_PROJECTS: "/admin/projects",
  ADMIN_SKILLS: "/admin/skills",
  ADMIN_EDUCATION: "/admin/education",
  ADMIN_CERTIFICATIONS: "/admin/certifications",
  ADMIN_ACHIEVEMENTS: "/admin/achievements",
  ADMIN_MESSAGES: "/admin/messages",
};

export const PROJECT_CATEGORIES = [
  "All",
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "Machine Learning",
  "AI"
];

export const SKILL_CATEGORIES = [
  "Languages",
  "Frameworks",
  "Databases",
  "Tools",
  "Devops",
];

export const ACHIEVEMENT_CATEGORIES = [
  "Hackathon",
  "Open Source",
  "Academic",
  "Competition",
  "Other",
];

export const EDUCATION_TYPES = ["College", "School"];
