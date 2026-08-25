import { motion as Motion } from "framer-motion";
import { HiAcademicCap } from "react-icons/hi";
import { BsCalendar3 } from "react-icons/bs";
import { formatYearRange } from "../../utils/formatDate";

const EducationCard = ({ education }) => {
  const {
    institution,
    type,
    degree,
    branch,
    standard,
    board,
    cgpa,
    percentage,
    currentYear,
    startYear,
    endYear,
    passingYear,
    description,
    highlights = [],
    logoUrl,
  } = education;

  const isCollege = type === "College";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card border border-border rounded-2xl p-6
                 hover:border-primary/30 hover:shadow-sm
                 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Logo or icon */}
        <div className="flex-shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={institution}
              className="w-12 h-12 rounded-xl object-contain bg-muted p-1"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-xl bg-accent flex items-center
                            justify-center"
            >
              <HiAcademicCap className="text-accent-foreground text-2xl" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Type badge */}
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full
                           bg-primary/10 text-primary w-fit"
          >
            {type}
          </span>

          {/* Institution */}
          <h3 className="font-bold text-foreground text-lg leading-tight">
            {institution}
          </h3>

          {/* College specific */}
          {isCollege && (
            <p className="text-sm text-muted-foreground">
              {degree} {branch ? `in ${branch}` : ""}
              {currentYear ? ` · ${currentYear}` : ""}
            </p>
          )}

          {/* School specific */}
          {!isCollege && (
            <p className="text-sm text-muted-foreground">
              {standard ? `Class ${standard}` : ""}
              {board ? ` · ${board}` : ""}
            </p>
          )}

          {/* Year range */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BsCalendar3 />
            {type==="College"? (
              <span>{formatYearRange(startYear, endYear)}</span>
            ):(
              <span>Passed {passingYear}</span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {/* Score */}
          <div className="flex items-center gap-3 flex-wrap">
            {isCollege && cgpa && (
              <span
                className="inline-flex items-center gap-1.5 text-xs
                               font-medium bg-accent text-accent-foreground
                               px-3 py-1 rounded-full border border-border"
              >
                CGPA: <strong className="text-primary">{cgpa}</strong> / 10
              </span>
            )}
            {!isCollege && percentage && (
              <span
                className="inline-flex items-center gap-1.5 text-xs
                               font-medium bg-accent text-accent-foreground
                               px-3 py-1 rounded-full border border-border"
              >
                Score: <strong className="text-primary">{percentage}%</strong>
              </span>
            )}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <ul className="flex flex-col gap-1 mt-1">
              {highlights.map((h, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-0.5">›</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default EducationCard;
