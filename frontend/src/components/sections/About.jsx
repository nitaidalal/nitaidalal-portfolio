import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { TbCode, TbBulb, TbRocket } from "react-icons/tb";
import { profileService } from "../../services/profile.service";
import PageWrapper from "../layout/PageWrapper";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";

const StatCard = ({ icon: Icon, label, value }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-card border border-border rounded-xl p-4
               flex flex-col gap-2 hover:border-primary/30
               hover:shadow-sm transition-all duration-300"
  >
    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
      <Icon className="text-primary text-lg" />
    </div>
    <p className="text-xs text-muted-foreground font-medium">{label}</p>
    <p className="text-sm font-semibold text-foreground leading-snug">
      {value}
    </p>
  </Motion.div>
);

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!profile) return null;

  const stats = [
    profile.currentlyBuilding && {
      icon: TbCode,
      label: "Currently Building",
      value: profile.currentlyBuilding,
    },
    profile.currentlyLearning && {
      icon: TbBulb,
      label: "Currently Learning",
      value: profile.currentlyLearning,
    },
    profile.funFact && {
      icon: TbRocket,
      label: "Fun Fact",
      value: profile.funFact,
    },
  ].filter(Boolean);

  return (
    <section id="about" className="py-24 bg-background">
      <PageWrapper>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left: heading + bio */}
          <div className="flex flex-col gap-6 flex-1">
            <SectionHeading label="About Me" title="Who I Am" align="left" />

            {profile.bio && (
              <Motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-muted-foreground leading-relaxed text-base"
              >
                {profile.bio}
              </Motion.p>
            )}

            {profile.location && (
              <Motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <span>📍</span>
                <span>{profile.location}</span>
              </Motion.p>
            )}
          </div>

          {/* Right: stat cards */}
          {stats.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1
                            gap-3 w-full lg:w-72 flex-shrink-0"
            >
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default About;
