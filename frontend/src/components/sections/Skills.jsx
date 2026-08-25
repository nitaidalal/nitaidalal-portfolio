import { useEffect, useState } from "react";
import { skillService } from "../../services/skill.service";
import SkillCard from "../cards/SkillCard";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";
import PageWrapper from "../layout/PageWrapper";
import { SKILL_CATEGORIES } from "../../utils/constants";

const Skills = () => {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchSkills = () => {
    setLoading(true);
    setError(null);
    skillService.getAll()
      .then((res) => {
        const groupedSkills = res?.data?.groupedSkills || {};
        setGrouped(groupedSkills);
      })
      .catch(() => setError("Failed to load skills"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);

  return (
    <section id="skills" className="py-24 bg-background">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="Skills"
            title="What I Work With"
            subtitle="Technologies and tools I use to bring ideas to life"
          />

          {loading && <LoadingSpinner />}
          {error   && <ErrorMessage message={error} onRetry={fetchSkills} />}

          {!loading && !error && (
            <div className="flex flex-col gap-10">
              {SKILL_CATEGORIES.map((category) => {
                const skills = grouped[category];
                if (!skills?.length) return null;
                return (
                  <div key={category} className="flex flex-col gap-4">
                    {/* Category label */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-foreground
                                     uppercase tracking-wider">
                        {category}
                      </h3>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {skills.length} {skills.length === 1 ? "skill" : "skills"}
                      </span>
                    </div>

                    {/* Skills grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3
                                    md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {skills.map((skill) => (
                        <SkillCard key={skill._id} skill={skill} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default Skills;