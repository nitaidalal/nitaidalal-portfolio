import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MdOutlineFolder,
  MdOutlineEmail,
  MdOutlinePerson,
  MdOutlineSchool,
} from "react-icons/md";
import { TbTrophy, TbCertificate } from "react-icons/tb";
import { HiOutlineChip } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";
import { projectService } from "../../services/project.service";
import { skillService } from "../../services/skill.service";
import { certificationService } from "../../services/certification.service";
import { achievementService } from "../../services/achievement.service";
import { contactService } from "../../services/contact.service";
import { APP_ROUTES } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

// ─── Stat card ────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, href, color, delay }) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
  >
    <Link
      to={href}
      className="group flex items-center gap-4 bg-card border border-border
                 rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm
                 transition-all duration-300"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center
                   flex-shrink-0"
        style={{ backgroundColor: `var(--accent)` }}
      >
        <Icon className="text-2xl text-primary" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-2xl font-extrabold text-foreground leading-none">
          {value ?? "—"}
        </span>
        <span className="text-xs text-muted-foreground font-medium mt-0.5">
          {label}
        </span>
      </div>

      <HiArrowRight
        className="text-muted-foreground group-hover:text-primary
                   group-hover:translate-x-1 transition-all duration-200
                   flex-shrink-0"
      />
    </Link>
  </Motion.div>
);

// ─── Quick action card ────────────────────────────────
const QuickAction = ({ icon: Icon, label, href, delay }) => (
  <Motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
  >
    <Link
      to={href}
      className="group flex flex-col items-center gap-2 p-4 bg-card
                 border border-border rounded-xl hover:border-primary/30
                 hover:bg-accent transition-all duration-200 text-center"
    >
      <div
        className="w-10 h-10 rounded-lg bg-accent flex items-center
                      justify-center group-hover:bg-primary/10
                      transition-colors"
      >
        <Icon className="text-xl text-primary" />
      </div>
      <span
        className="text-xs font-medium text-muted-foreground
                       group-hover:text-foreground transition-colors"
      >
        {label}
      </span>
    </Link>
  </Motion.div>
);

// ─── Dashboard page ───────────────────────────────────
const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    projects: null,
    skills: null,
    certifications: null,
    achievements: null,
    messages: null,
    unreadMessages: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, skills, certs, achievements, messages] =
          await Promise.allSettled([
            projectService.getAdminAll(),
            skillService.getAll(),
            certificationService.getAll(),
            achievementService.getAll(),
            contactService.getAll(),
          ]);

        const messageList = messages.value?.data;
        console.log("Fetched messages:", messageList);2
        

        setStats({
          projects: projects.value?.data?.length ?? 0,
          skills: skills.value?.data?.allSkills?.length ?? 0,
          certifications: certs.value?.data?.length ?? 0,
          achievements: achievements.value?.data?.length ?? 0,
          messages: Array.isArray(messageList) ? messageList.length : 0,
          unreadMessages: Array.isArray(messageList)
            ? messageList.filter((message) => !message.isRead).length
            : 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  const STAT_CARDS = [
    {
      icon: MdOutlineFolder,
      label: "Total Projects",
      value: stats.projects,
      href: APP_ROUTES.ADMIN_PROJECTS,
      delay: 0.05,
    },
    {
      icon: HiOutlineChip,
      label: "Skills",
      value: stats.skills,
      href: APP_ROUTES.ADMIN_SKILLS,
      delay: 0.1,
    },
    {
      icon: TbCertificate,
      label: "Certifications",
      value: stats.certifications,
      href: APP_ROUTES.ADMIN_CERTIFICATIONS,
      delay: 0.15,
    },
    {
      icon: TbTrophy,
      label: "Achievements",
      value: stats.achievements,
      href: APP_ROUTES.ADMIN_ACHIEVEMENTS,
      delay: 0.2,
    },
    {
      icon: MdOutlineEmail,
      label: "Messages",
      value: stats.messages,
      href: APP_ROUTES.ADMIN_MESSAGES,
      delay: 0.25,
    },
  ];

  const QUICK_ACTIONS = [
    {
      icon: MdOutlinePerson,
      label: "Edit Profile",
      href: APP_ROUTES.ADMIN_PROFILE,
    },
    {
      icon: MdOutlineFolder,
      label: "Add Project",
      href: APP_ROUTES.ADMIN_PROJECTS,
    },
    { icon: HiOutlineChip, label: "Add Skill", href: APP_ROUTES.ADMIN_SKILLS },
    {
      icon: MdOutlineSchool,
      label: "Add Education",
      href: APP_ROUTES.ADMIN_EDUCATION,
    },
    {
      icon: TbCertificate,
      label: "Add Certification",
      href: APP_ROUTES.ADMIN_CERTIFICATIONS,
    },
    {
      icon: TbTrophy,
      label: "Add Achievement",
      href: APP_ROUTES.ADMIN_ACHIEVEMENTS,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* ── Welcome banner ──────────────────────── */}
      <Motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6
                   flex flex-col sm:flex-row sm:items-center
                   justify-between gap-4"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-foreground">
            Welcome back, {admin?.email?.split("@")[0]} 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your portfolio today.
          </p>
        </div>

        {/* Unread messages badge */}
        {stats.unreadMessages > 0 && (
          <Link
            to={APP_ROUTES.ADMIN_MESSAGES}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       bg-primary/10 border border-primary/20 text-primary
                       text-sm font-semibold hover:bg-primary/20
                       transition-colors duration-200 w-fit"
          >
            <BsCircleFill className="text-xs animate-pulse" />
            {stats.unreadMessages} unread{" "}
            {stats.unreadMessages === 1 ? "message" : "messages"}
          </Link>
        )}
      </Motion.div>

      {/* ── Stats grid ──────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-sm font-semibold text-muted-foreground
                       uppercase tracking-wider"
        >
          Overview
        </h3>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                        xl:grid-cols-5 gap-4"
        >
          {STAT_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      {/* ── Quick actions ────────────────────────── */}
      <div className="flex flex-col gap-3">
        <h3
          className="text-sm font-semibold text-muted-foreground
                       uppercase tracking-wider"
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <QuickAction key={action.label} {...action} delay={i * 0.05} />
          ))}
        </div>
      </div>

      {/* ── Portfolio status ─────────────────────── */}
      <Motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6
                   flex flex-col gap-4"
      >
        <h3 className="text-sm font-semibold text-foreground">
          Portfolio Checklist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Profile set up", done: true },
            { label: "At least 1 project", done: (stats.projects ?? 0) > 0 },
            { label: "Skills added", done: (stats.skills ?? 0) > 0 },
            {
              label: "Certifications added",
              done: (stats.certifications ?? 0) > 0,
            },
            {
              label: "Achievements added",
              done: (stats.achievements ?? 0) > 0,
            },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center
                               justify-center flex-shrink-0 text-xs font-bold
                               ${
                                 done
                                   ? "bg-primary text-primary-foreground"
                                   : "bg-muted text-muted-foreground border border-border"
                               }`}
              >
                {done ? "✓" : "○"}
              </div>
              <span
                className={done ? "text-foreground" : "text-muted-foreground"}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </Motion.div>
    </div>
  );
};

export default Dashboard;
