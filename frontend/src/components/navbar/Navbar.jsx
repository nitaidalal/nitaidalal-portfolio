import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Code2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ThemeSwitcher from "../theme/ThemeSwitcher";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Education", href: "/#education" },
  { label: "Achievements", href: "/#achievements" },
  { label: "Contact", href: "/#contact" },
];

// Smooth scroll to section when clicking hash links
const handleNavClick = (e, href) => {
  if (!href.startsWith("/#")) return;

  e.preventDefault();

  const id = href.replace("/#", "");
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

const NavLinks = ({ onClick }) => (
  <>
    {NAV_LINKS.map((link) => (
      <a
        key={link.href}
        href={link.href}
        onClick={(e) => {
          handleNavClick(e, link.href);
          onClick?.();
        }}
        className="
          relative
          text-sm
          font-medium
          text-foreground-soft
          hover:text-foreground
          transition-colors
          duration-200
          group
        "
      >
        {link.label}

        {/* Animated underline */}
        <span
          className="
            absolute
            -bottom-0.5
            left-0
            h-px
            w-0
            bg-primary
            transition-all
            duration-300
            group-hover:w-full
          "
        />
      </a>
    ))}
  </>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Add backdrop when scrolled
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className={`
        fixed
        top-0
        inset-x-0
        z-50
        transition-all
        duration-300
        ${
          scrolled
            ? "bg-card/80 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }
      `}
    >
      <nav
        className="
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          h-16
          flex
          items-center
          justify-between
          gap-4
        "
      >
        {/* Logo */}
        <a
          href="/"
          className="
            flex
            items-center
            gap-2
            group
            flex-shrink-0
          "
          aria-label="Home"
        >
          <motion.div
            whileHover={{
              rotate: 12,
              scale: 1.1,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
            }}
            className="
              w-8
              h-8
              rounded-lg
              bg-primary
              flex
              items-center
              justify-center
            "
          >
            <Code2 size={16} className="text-primary-foreground" />
          </motion.div>

          <span
            className="
              font-bold
              text-base
              text-foreground
              tracking-tight
            "
          >
            Nitai<span className="text-primary">.</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop theme switcher */}
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="
                  md:hidden
                  p-2
                  rounded-lg
                  text-foreground-soft
                  hover:bg-accent
                  hover:text-accent-foreground
                  transition-colors
                  duration-200
                "
                aria-label="Open menu"
              >
                <Menu size={20} />
              </motion.button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="
                w-72
                bg-card
                border-l
                border-border
                p-0
              "
            >
              <div className="flex flex-col h-full">
                {/* Sheet header */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    px-6
                    py-5
                    border-b
                    border-border
                  "
                >
                  <span className="font-bold text-foreground">
                    Nitai<span className="text-primary">.</span>
                  </span>
                </div>

                {/* Mobile navigation */}
                <div className="flex flex-col gap-1 px-4 py-6">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{
                        opacity: 0,
                        x: 20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.2,
                      }}
                      onClick={(e) => {
                        handleNavClick(e, link.href);
                        setMobileOpen(false);
                      }}
                      className="
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-lg
                        text-sm
                        font-medium
                        text-foreground-soft
                        hover:bg-accent
                        hover:text-accent-foreground
                        transition-colors
                        duration-150
                      "
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile theme switcher */}
                <div
                  className="
                    mt-auto
                    px-6
                    py-5
                    border-t
                    border-border
                  "
                >
                  <p
                    className="
                      text-xs
                      text-muted-foreground
                      mb-3
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Appearance
                  </p>

                  <ThemeSwitcher inSheet />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
