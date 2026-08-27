
import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { TbCode, TbBulb, TbRocket } from "react-icons/tb";
import {
  MdOutlineLocationOn,
  MdOutlineSchool,
  MdOutlineWork,
} from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { profileService } from "../../services/profile.service";
import { skillService } from "../../services/skill.service";
import PageWrapper from "../layout/PageWrapper";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";

const SkillChip = ({ skill }) => (
  <div
    className="flex shrink-0 items-center gap-2 px-3 py-1.5
    bg-card border border-border rounded-lg
    hover:border-primary/40 hover:bg-accent
    transition-colors duration-200"
  >
    {skill.iconSlug && (
      <img
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.iconSlug}/${skill.iconSlug}-original.svg`}
        alt={skill.name}
        className="w-6 h-6 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    )}

    <span className="text-xs sm:text-base font-medium text-foreground whitespace-nowrap">
      {skill.name}
    </span>
  </div>
);

// ─── Right side stat card ─────────────────────────────
const StatCard = ({ icon: Icon, label, value, delay }) => (
  <Motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="bg-card border border-border rounded-xl p-4
               flex items-center gap-4 hover:border-primary/30
               transition-all duration-300"
  >
    <div
      className="w-9 h-9 rounded-lg bg-accent flex items-center
                    justify-center flex-shrink-0"
    >
      <Icon className="text-primary text-lg" />
    </div>
    <div className="flex flex-col min-w-0">
      <p
        className="text-xs font-semibold text-muted-foreground
                   uppercase tracking-wider"
      >
        {label}
      </p>
      <p className="text-sm font-bold text-foreground leading-snug truncate">
        {value}
      </p>
    </div>
  </Motion.div>
);

// ─── Bottom info chip ─────────────────────────────────
const InfoChip = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-8 h-8 rounded-lg bg-accent flex items-center
                    justify-center flex-shrink-0"
    >
      <Icon className="text-primary text-sm" />
    </div>
    <div className="flex flex-col">
      <span
        className="text-xs text-muted-foreground uppercase
                       tracking-wider font-semibold"
      >
        {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  </div>
);

const About = () => {
  const [profile, setProfile] = useState(null);
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      profileService.getProfile(),
      skillService.getFeatured(), // featured=true
    ])
      .then(([profileRes, skillsRes]) => {
        setProfile(profileRes.data);
        setFeaturedSkills(skillsRes.data.allSkills || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!profile) return null;

  const statCards = [
    profile.currentlyBuilding && {
      icon: TbCode,
      label: "Currently Building",
      value: profile.currentlyBuilding,
      delay: 0.1,
    },
    profile.currentlyLearning && {
      icon: TbBulb,
      label: "Currently Learning",
      value: profile.currentlyLearning,
      delay: 0.2,
    },
    profile.funFact && {
      icon: TbRocket,
      label: "Fun Fact",
      value: profile.funFact,
      delay: 0.3,
    },
  ].filter(Boolean);

  const infoChips = [
    profile.location && {
      icon: MdOutlineLocationOn,
      label: "Location",
      value: profile.location,
    },
    profile.education && {
      icon: MdOutlineSchool,
      label: "Education",
      value: profile.education,
    },
    profile.role && {
      icon: MdOutlineWork,
      label: "Role",
      value: profile.role,
    },
  ].filter(Boolean);

  return (
    <section id="about" className="py-24 bg-background">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading label="About Me" title="Who I Am" align="left" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* ── Left col (3/5) ──────────────────── */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Bio */}
              {profile.bio && (
                <Motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-foreground font-semibold text-lg
                             leading-relaxed"
                >
                  {profile.bio}
                </Motion.p>
              )}

              {/* Description (second paragraph) */}
              {profile.description && (
                <Motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-muted-foreground leading-relaxed"
                >
                  {profile.description}
                </Motion.p>
              )}

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Info chips row */}
              {infoChips.length > 0 && (
                <Motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="flex flex-wrap gap-6"
                >
                  {infoChips.map((chip) => (
                    <InfoChip key={chip.label} {...chip} />
                  ))}
                </Motion.div>
              )}

              {/* Divider */}
              {featuredSkills.length > 0 && <div className="h-px bg-border" />}

              {/* Featured tech stack */}
              {featuredSkills.length > 0 && (
                <Motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-px bg-foreground" />
                    <span
                      className="text-xs font-bold text-foreground
                                     uppercase tracking-widest"
                    >
                      Tech Stack
                    </span>
                  </div>

                  {/* Featured Tech Stack */}
                  <div className="relative overflow-hidden">
                    <div className="flex w-max gap-2 animate-marquee">
                      {/* First set */}
                      <div className="flex shrink-0 gap-2">
                        {featuredSkills.map((skill) => (
                          <SkillChip key={skill._id} skill={skill} />
                        ))}
                      </div>

                      {/* Duplicate set for seamless loop */}
                      <div className="flex shrink-0 gap-2">
                        {featuredSkills.map((skill) => (
                          <SkillChip
                            key={`duplicate-${skill._id}`}
                            skill={skill}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              )}
            </div>

            {/* ── Right col (2/5) ─────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {/* Stat cards */}
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}

              {/* Open to opportunities card */}
              <Motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-card border border-primary/30 rounded-xl p-4
                           flex flex-col gap-2 mt-1"
              >
                <div className="flex items-center gap-2">
                  <BsCircleFill className="text-primary text-xs animate-pulse" />
                  <span
                    className="text-xs font-bold text-primary uppercase
                                   tracking-wider"
                  >
                    Open to Opportunities
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Looking for opportunities where I can build meaningful
                  products, learn from experienced developers and grow as an
                  engineer.
                </p>
              </Motion.div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </section>
  );
};

export default About;
