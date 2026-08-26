import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar  from "./AdminTopbar";

const SIDEBAR_WIDTH     = 240;
const SIDEBAR_COLLAPSED = 68;

const AdminLayout = () => {
  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);

  // detect mobile breakpoint
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const sidebarWidth = collapsed && !isMobile
    ? SIDEBAR_COLLAPSED
    : SIDEBAR_WIDTH;

  return (
    <div className="h-screen bg-background flex overflow-hidden">

      {/* ── Desktop sidebar ───────────────────────── */}
      {!isMobile && (
        <Motion.div
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="hidden md:flex flex-col flex-shrink-0 overflow-hidden
                     h-screen sticky top-0"
          style={{ width: sidebarWidth }}
        >
          <AdminSidebar collapsed={collapsed} />
        </Motion.div>
      )}

      {/* ── Mobile sidebar overlay ────────────────── */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <>
            {/* Backdrop */}
            <Motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1  }}
              exit={{ opacity: 0    }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Sidebar drawer */}
            <Motion.div
              key="drawer"
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0            }}
              exit={{ x: -SIDEBAR_WIDTH  }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <AdminSidebar
                collapsed={false}
                onClose={() => setMobileOpen(false)}
              />
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ─────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <AdminTopbar onMenuToggle={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="p-4 sm:p-6 max-w-7xl mx-auto w-full"
          >
            <Outlet />
          </Motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;