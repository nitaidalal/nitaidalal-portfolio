import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  SiLeetcode,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiTypescript,
} from "react-icons/si";
import { HiArrowDown } from "react-icons/hi";
import { MdOutlineFileDownload } from "react-icons/md";
import { MapPin, ArrowUpRight } from "lucide-react";


import { profileService } from "../../services/profile.service";
import LoadingSpinner from "../shared/LoadingSpinner";
import PageWrapper from "../layout/PageWrapper";

// typewriter hook
const useTypewriter = (words = [], speed = 80, pause = 1800) => {
  const [text,        setText]        = useState("");
  const [wordIndex,   setWordIndex]   = useState(0);
  const [charIndex,   setCharIndex]   = useState(0);
  const [deleting,    setDeleting]    = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[wordIndex % words.length];

    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIndex((c) => c + 1);
        }
      } else {
        setText(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setWordIndex((w) => (w + 1) % words.length);
          setCharIndex(0);
        } else {
          setCharIndex((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return text;
};

const SOCIAL_MAP = {
  github:   { icon: FaGithub,   label: "GitHub"   },
  linkedin: { icon: FaLinkedin, label: "LinkedIn"  },
  leetcode: { icon: SiLeetcode, label: "LeetCode"  },
};

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getProfile()
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const typedText = useTypewriter(profile?.taglines || []);

  if (loading) return <LoadingSpinner fullScreen />;

  const handleScrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewWork = (e) => {
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  const FLOATING_ICONS = [
    { slug: "react", icon: SiReact, top: "15%", left: "8%", delay: 0, duration: 6 },
    { slug: "nodejs", icon: SiNodedotjs, top: "70%", left: "5%", delay: 1, duration: 7 },
    { slug: "mongodb", icon: SiMongodb, top: "25%", right: "6%", delay: 0.5, duration: 8 },
    { slug: "typescript", icon: SiTypescript, top: "65%", right: "8%", delay: 1.5, duration: 6 },
  ];

  return (
    <section
      className="min-h-screen flex items-center pt-20 sm:pt-12 pb-8
                        bg-background relative overflow-hidden"
    >
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, var(--border) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />

      {/* Soft glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[600px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse, var(--accent) 0%, transparent 70%)`,
          opacity: 0.5,
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {FLOATING_ICONS.map(({ slug, icon: Icon, delay, duration, ...pos }) => (
          <Motion.div
            key={slug}
            className="absolute opacity-[0.18]"
            style={pos}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon
              className="w-10 h-10 sm:w-14 sm:h-14"
              style={{ color: "var(--primary)" }}
            />
          </Motion.div>
        ))}
      </div>

      <PageWrapper className="relative z-10 w-full">
        <div
          className="flex flex-col lg:flex-row items-center
                        justify-between gap-12 lg:gap-16"
        >
          {/* ── Left: Text content ──────────────── */}
          <Motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 flex-1 text-center lg:text-left"
          >
            {/* Greeting */}
            <Motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-primary bg-accent text-accent-foreground px-4 py-2 rounded-full border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Hi there, I'm
              </span>
            </Motion.div>

            {/* Name */}
            <Motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold
                         text-foreground leading-none tracking-tight"
            >
              {profile?.name || "Nitai Dalal"}
              <span className="text-primary">.</span>
            </Motion.h1>

            {/* Typewriter */}
            <Motion.div
              variants={itemVariants}
              className="text-xl sm:text-2xl font-semibold text-muted-foreground
                         h-8 flex items-center justify-center lg:justify-start gap-2"
            >
              <span>I am a</span>
              <span className="text-primary">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </Motion.div>

            {/* Subtitle */}
            {profile?.heroSubtitle && (
              <Motion.p
                variants={itemVariants}
                className="text-base text-muted-foreground max-w-lg
                           mx-auto lg:mx-0 leading-relaxed"
              >
                {profile.heroSubtitle}
              </Motion.p>
            )}

            {/* CTA buttons */}
            <Motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3
                         justify-center lg:justify-start"
            >
              <a
                href="#projects"
                onClick={handleViewWork}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-sm"
              >
                View My Work
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl
                             bg-card border border-border text-foreground
                             font-semibold text-sm hover:bg-accent
                             hover:border-primary/30 transition-all duration-200"
                >
                  <MdOutlineFileDownload className="text-base" />
                  Download Resume
                </a>
              )}
            </Motion.div>

            {/* Social links */}
            {profile?.socialLinks && (
              <Motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-3 lg:items-start"
              >
                <div className="flex items-center gap-3">
                  {Object.entries(SOCIAL_MAP).map(
                    ([key, { icon: Icon, label }]) => {
                      const url = profile.socialLinks[key];
                      if (!url) return null;
                      return (
                        <Motion.a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          whileHover={{ scale: 1.15, y: -2 }}
                          whileTap={{ scale: 0.92 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                          className="w-10 h-10 rounded-xl bg-card border border-border
                                   flex items-center justify-center text-muted-foreground
                                   hover:text-primary hover:border-primary/40
                                   hover:bg-accent transition-colors duration-200"
                        >
                          <Icon className="text-lg" />
                        </Motion.a>
                      );
                    },
                  )}
                </div>

                {profile?.location && (
                  <Motion.div
                    variants={itemVariants}
                    className="flex items-center gap-2 justify-center lg:justify-start text-sm text-muted-foreground"
                  >
                    <MapPin size={16} className="text-primary" />
                    <span>{profile.location}</span>
                  </Motion.div>
                )}
              </Motion.div>
            )}
          </Motion.div>

          {/* ── Right: Avatar ───────────────────── */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Outer ring */}
              <div
                className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72
                              rounded-full p-1 bg-gradient-to-br
                              from-primary via-accent to-card"
              >
                {/* Inner ring */}
                <div>
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full bg-accent
                                    flex items-center justify-center"
                    >
                      <span className="text-6xl font-extrabold text-primary">
                        {profile?.name?.charAt(0) || "N"}
                      </span>
                    </div>
                  )}
                  <Motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    className="absolute -bottom-3 -right-3 bg-card border border-border rounded-xl px-4 py-2.5 shadow-lg"
                  >
                    <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {"Open to work"}
                    </p>
                  </Motion.div>
                </div>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Scroll down indicator */}
        <Motion.button
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute hidden sm:flex  left-1/2 -translate-x-1/2
                      flex-col items-center gap-1 text-muted-foreground
                     hover:text-primary transition-colors duration-200"
          aria-label="Scroll down"
        >
          <span className="text-xs font-medium">Scroll</span>
          <Motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <HiArrowDown className="text-lg" />
          </Motion.div>
        </Motion.button>
      </PageWrapper>
    </section>
  );
};

export default Hero;