import { motion as Motion } from "framer-motion";

const SkillCard = ({ skill }) => {
  const { name, iconSlug, proficiencyPercentage, category } = skill;

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group bg-card border border-border rounded-xl p-4
                 flex flex-col gap-3 hover:border-primary/30
                 hover:shadow-sm transition-all duration-300"
    >
      {/* Icon + Name */}
      <div className="flex items-center gap-3">
        {iconSlug ? (
          <img
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconSlug}/${iconSlug}-original.svg`}
            alt={name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              // fallback if icon not found
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* fallback letter avatar */}
        <div
          className="w-8 h-8 rounded-lg bg-accent flex items-center
                     justify-center text-accent-foreground font-bold text-sm"
          style={{ display: iconSlug ? "none" : "flex" }}
        >
          {name?.charAt(0)}
        </div>

        <span
          className="text-sm font-semibold text-foreground
                         group-hover:text-primary transition-colors"
        >
          {name}
        </span>
      </div>

      {/* Proficiency bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{category}</span>
          <span className="text-xs font-medium text-primary">
            {proficiencyPercentage}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <Motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${proficiencyPercentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>
    </Motion.div>
  );
};

export default SkillCard;
