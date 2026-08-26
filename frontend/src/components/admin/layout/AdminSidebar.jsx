import { NavLink, useNavigate } from "react-router-dom";
// import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  MdDashboard,
  MdOutlineFolder,
  MdOutlineSchool,
  MdOutlineEmail,
  MdOutlinePerson,
} from "react-icons/md";
import { TbCode, TbTrophy, TbCertificate } from "react-icons/tb";
import { HiOutlineChip } from "react-icons/hi";
import { RiLogoutBoxLine } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import { APP_ROUTES } from "../../../utils/constants";

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        href: APP_ROUTES.ADMIN_DASHBOARD,
        icon: MdDashboard,
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        label: "Profile",
        href: APP_ROUTES.ADMIN_PROFILE,
        icon: MdOutlinePerson,
      },
      {
        label: "Projects",
        href: APP_ROUTES.ADMIN_PROJECTS,
        icon: MdOutlineFolder,
      },
      { label: "Skills", href: APP_ROUTES.ADMIN_SKILLS, icon: HiOutlineChip },
      {
        label: "Education",
        href: APP_ROUTES.ADMIN_EDUCATION,
        icon: MdOutlineSchool,
      },
      {
        label: "Certifications",
        href: APP_ROUTES.ADMIN_CERTIFICATIONS,
        icon: TbCertificate,
      },
      {
        label: "Achievements",
        href: APP_ROUTES.ADMIN_ACHIEVEMENTS,
        icon: TbTrophy,
      },
    ],
  },
  {
    group: "Inbox",
    items: [
      {
        label: "Messages",
        href: APP_ROUTES.ADMIN_MESSAGES,
        icon: MdOutlineEmail,
      },
    ],
  },
];

const AdminSidebar = ({ collapsed, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(APP_ROUTES.ADMIN_LOGIN);
  };

  return (
    <aside className="flex flex-col h-full  bg-card border-r border-border">
      {/* ── Logo ──────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-5 py-5
                      border-b border-border flex-shrink-0"
      >
        <div
          className="w-8 h-8 rounded-lg bg-primary flex items-center
                        justify-center flex-shrink-0"
        >
          <TbCode className="text-primary-foreground text-base" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-primary text-sm ">
              Nitai Dalal
            </span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        )}
      </div>

      {/* ── Nav items ─────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="flex flex-col gap-1">
            {/* Group label */}
            {!collapsed && (
              <p
                className="text-xs font-semibold text-muted-foreground
                             uppercase tracking-wider px-2 mb-1"
              >
                {group.group}
              </p>
            )}

            {group.items.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                   font-medium transition-all duration-200 group
                   ${
                     isActive
                       ? "bg-primary text-primary-foreground shadow-sm"
                       : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                   }`
                }
              >
                <Icon className="text-lg flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Logout ────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-border flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                     text-sm font-medium text-muted-foreground w-full
                     hover:bg-destructive/10 hover:text-destructive
                     transition-all duration-200"
        >
          <RiLogoutBoxLine className="text-lg flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
