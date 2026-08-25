import { motion as Motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { BsCalendar3 } from "react-icons/bs";
import { formatFullDate } from "../../utils/formatDate";

const CATEGORY_EMOJI = {
  Hackathon:    "🏆",
  "Open Source":"🌐",
  Academic:     "🎓",
  Competition:  "🥇",
  Other:        "⭐",
};

const AchievementCard = ({ achievement }) => {
  const { title, description, date, category, imageUrl, proofLink } = achievement;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group bg-card border border-border rounded-2xl p-5
                 flex flex-col gap-3 hover:border-primary/30
                 hover:shadow-sm transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">

        {/* Icon / image */}
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center
                            justify-center text-xl">
              {CATEGORY_EMOJI[category] || "⭐"}
            </div>
          )}
        </div>

        {/* Category badge */}
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full
                         bg-primary/10 text-primary flex-shrink-0">
          {category || "Other"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-foreground text-sm leading-snug
                       group-hover:text-primary transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1
                      border-t border-border">
        {date && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BsCalendar3 />
            <span>{formatFullDate(date)}</span>
          </div>
        )}

        {proofLink && (
          <a
            href={proofLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium
                       text-primary hover:underline ml-auto"
          >
            <FiExternalLink />
            Proof
          </a>
        )}
      </div>
    </Motion.div>
  );
};

export default AchievementCard;