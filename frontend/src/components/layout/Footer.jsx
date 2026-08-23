import { motion as Motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { TbCode } from "react-icons/tb";
import PageWrapper from "./PageWrapper";

const SOCIAL_LINKS = [
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: SiLeetcode, href: "https://leetcode.com", label: "LeetCode" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-24">
      <PageWrapper>
        <div
          className="py-10 flex flex-col sm:flex-row items-center
                        justify-between gap-6"
        >
          {/* Logo + tagline */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg bg-primary flex items-center
                              justify-center"
              >
                <TbCode className="text-primary-foreground text-sm" />
              </div>
              <span className="font-bold text-foreground text-sm">
                Nitai<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built with React + MERN Stack
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <Motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-9 h-9 rounded-lg bg-secondary border border-border
                           flex items-center justify-center
                           text-muted-foreground hover:text-primary
                           hover:border-primary hover:bg-accent
                           transition-colors duration-200"
              >
                <Icon className="text-base" />
              </Motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            © {year} Nitai Dalal. All rights reserved.
          </p>
        </div>
      </PageWrapper>
    </footer>
  );
};

export default Footer;
