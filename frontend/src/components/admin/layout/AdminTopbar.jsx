import { useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { HiMenuAlt2 } from "react-icons/hi";
import { MdOutlineOpenInNew } from "react-icons/md";
import ThemeSwitcher from "../../theme/ThemeSwitcher";
import useAuth from "../../../hooks/useAuth";
import { APP_ROUTES } from "../../../utils/constants";

// map route → page title
const PAGE_TITLES = {
  [APP_ROUTES.ADMIN_DASHBOARD]:      "Dashboard",
  [APP_ROUTES.ADMIN_PROFILE]:        "Manage Profile",
  [APP_ROUTES.ADMIN_PROJECTS]:       "Manage Projects",
  [APP_ROUTES.ADMIN_SKILLS]:         "Manage Skills",
  [APP_ROUTES.ADMIN_EDUCATION]:      "Manage Education",
  [APP_ROUTES.ADMIN_CERTIFICATIONS]: "Manage Certifications",
  [APP_ROUTES.ADMIN_ACHIEVEMENTS]:   "Manage Achievements",
  [APP_ROUTES.ADMIN_MESSAGES]:       "Messages",
};

const AdminTopbar = ({ onMenuToggle }) => {
  const { admin }    = useAuth();
  const { pathname } = useLocation();

  const pageTitle = PAGE_TITLES[pathname] || "Admin";

  return (
    <header className="h-16 bg-card border-b border-border flex items-center
                       justify-between px-4 sm:px-6 flex-shrink-0">

      {/* ── Left: menu toggle + title ───────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-muted-foreground
                     hover:bg-accent hover:text-accent-foreground
                     transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <HiMenuAlt2 className="text-xl" />
        </button>

        <Motion.h1
          key={pageTitle}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.2 }}
          className="font-bold text-foreground text-base"
        >
          {pageTitle}
        </Motion.h1>
      </div>

      {/* ── Right: view site + theme + admin info ── */}
      <div className="flex items-center gap-3">

        {/* View live site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium
                     text-muted-foreground hover:text-primary px-3 py-1.5
                     rounded-lg border border-border hover:border-primary/30
                     hover:bg-accent transition-all duration-200"
        >
          <MdOutlineOpenInNew className="text-sm" />
          View Site
        </a>

        <ThemeSwitcher />

        {/* Admin email badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5
                        rounded-lg bg-accent border border-border">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center
                          justify-center text-primary-foreground text-xs font-bold">
            {admin?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
            {admin?.email}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;