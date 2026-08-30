import { motion as Motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { BsCalendar3 } from "react-icons/bs";
import { formatMonthYear } from "../../utils/formatDate";
import { Link } from "react-router-dom";


const ProjectCard = ({ project }) => {
  const {
    _id,
    title,
    shortDescription,
    techTags = [],
    category,
    imageUrl,
    liveUrl,
    repoUrl,
    startDate,
    endDate,
    isFeatured,
  } = project;

  return (
    <Link to={`/projects/${_id}`} className="block group">
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 , scale: 1.02  }}
      className="group bg-card border border-border rounded-2xl overflow-hidden
                 shadow-sm hover:shadow-md hover:border-primary/30
                 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-video">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform
                       duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/20 select-none">
              {title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {isFeatured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                           text-xs font-semibold bg-primary text-primary-foreground">
            Featured
          </span>
        )}

        {/* Category badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full
                         text-xs font-medium bg-card/90 backdrop-blur-sm
                         text-foreground border border-border">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-foreground text-lg leading-tight
                         group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>

          {/* Date range */}
          {startDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BsCalendar3 className="text-xs" />
              <span>
                {formatMonthYear(startDate)}
                {endDate ? ` – ${formatMonthYear(endDate)}` : " – Present"}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {shortDescription}
        </p>

        {/* Tech tags */}
        {techTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium
                           bg-accent text-accent-foreground border border-border"
              >
                {tag}
              </span>
            ))}
            {techTags.length > 4 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium
                               bg-muted text-muted-foreground">
                +{techTags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-1 border-t border-border mt-auto">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium
                         text-primary hover:underline transition-colors"
            >
              <FaExternalLinkAlt className="text-xs" />
              Live Demo
            </a>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium
                         text-muted-foreground hover:text-foreground
                         transition-colors"
            >
              <FaGithub className="text-sm" />
              Source
            </a>
          )}
          {!liveUrl && !repoUrl && (
            <span className="text-xs text-muted-foreground italic">
              Links coming soon
            </span>
          )}
        </div>
      </div>
    </Motion.div>
    </Link>
  );
};

export default ProjectCard;