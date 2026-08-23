import { motion as Motion } from "framer-motion";

const SectionHeading = ({ label, title, subtitle, align = "center" }) => {
  const alignClass = {
    center: "items-center text-center",
    left: "items-start text-left",
  }[align];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col gap-2 ${alignClass}`}
    >
      {/* eyebrow label */}
      {label && (
        <span
          className="text-xs font-semibold tracking-widest uppercase
                         text-primary bg-accent text-accent-foreground
                         px-3 py-1 rounded-full w-fit"
        >
          {label}
        </span>
      )}

      {/* main title */}
      <h2
        className="text-3xl sm:text-4xl font-bold text-foreground
                     leading-tight tracking-tight"
      >
        {title}
      </h2>

      {/* optional subtitle */}
      {subtitle && (
        <p
          className="text-muted-foreground text-base sm:text-lg
                      max-w-xl leading-relaxed"
        >
          {subtitle}
        </p>
      )}
    </Motion.div>
  );
};

export default SectionHeading;
