import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { HiMenu } from "react-icons/hi";
import { TbCode } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeSwitcher from "../theme/ThemeSwitcher";

const NAV_LINKS = [
  { label: "About",        href: "#about"        },
  { label: "Projects",     href: "#projects"      },
  { label: "Skills",       href: "#skills"        },
  { label: "Education",    href: "#education"     },
  { label: "Achievements", href: "#achievements"  },
  { label: "Contact",      href: "#contact"       },
];

const handleScroll = (e, href) => {
  e.preventDefault();
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16
                      flex items-center justify-between gap-4">

        {/* ── Logo ──────────────────────────────── */}
        <a href="/" aria-label="Home"
           className="flex items-center gap-2 flex-shrink-0">
          <Motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-8 h-8 rounded-lg bg-primary flex items-center
                       justify-center"
          >
            <TbCode className="text-primary-foreground text-base" />
          </Motion.div>
          <span className="font-bold text-base text-foreground tracking-tight">
            Nitai's Portfolio<span className="text-primary"></span>
          </span>
        </a>

        {/* ── Desktop links ──────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="relative text-sm font-medium text-muted-foreground
                         hover:text-foreground transition-colors duration-200
                         group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0
                               bg-primary transition-all duration-300
                               group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* ── Right: Theme + Mobile ──────────────── */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {/* Mobile sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Motion.button
                whileTap={{ scale: 0.92 }}
                className="md:hidden p-2 rounded-lg text-muted-foreground
                           hover:bg-accent hover:text-accent-foreground
                           transition-colors duration-200"
                aria-label="Open menu"
              >
                <HiMenu className="text-xl" />
              </Motion.button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 bg-card border-l border-border p-0"
            >
              <div className="flex flex-col h-full">

                {/* Sheet header */}
                <div className="flex items-center justify-between
                                px-6 py-5 border-b border-border">
                  <span className="font-bold text-foreground">
                    Nitai's Portfolio<span className="text-primary">.</span>
                  </span>
                </div>

                {/* Mobile links */}
                <div className="flex flex-col gap-1 px-4 py-6">
                  {NAV_LINKS.map((link, i) => (
                    <Motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0  }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      onClick={(e) => {
                        handleScroll(e, link.href);
                        setMobileOpen(false);
                      }}
                      className="flex items-center px-3 py-2.5 rounded-lg
                                 text-sm font-medium text-muted-foreground
                                 hover:bg-accent hover:text-accent-foreground
                                 transition-colors duration-150"
                    >
                      {link.label}
                    </Motion.a>
                  ))}
                </div>

                {/* Theme switcher in sheet */}
                <div className="mt-auto px-6 py-5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3
                                font-medium uppercase tracking-wider">
                    Theme
                  </p>
                  <ThemeSwitcher inSheet />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </Motion.header>
  );
};

export default Navbar;