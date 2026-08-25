import { motion as Motion } from "framer-motion";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";
import { formatMonthYear } from "../../utils/formatDate";

const CertificationCard = ({ cert }) => {
  const { title, issuer, issueDate, imageUrl, verificationUrl } = cert;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="group bg-card border border-border rounded-2xl p-5
                 flex flex-col gap-4 hover:border-primary/30
                 hover:shadow-sm transition-all duration-300"
    >
      {/* Image or icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-14 h-14 rounded-xl object-contain bg-muted p-1"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center
                            justify-center">
              <HiOutlineBadgeCheck className="text-primary text-2xl" />
            </div>
          )}
        </div>

        {/* Verify link */}
        {verificationUrl && (
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium
                       text-primary hover:underline flex-shrink-0"
          >
            <FiExternalLink />
            Verify
          </a>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-bold text-foreground text-sm leading-snug
                       group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground font-medium">{issuer}</p>
        {issueDate && (
          <p className="text-xs text-muted-foreground">
            {formatMonthYear(issueDate)}
          </p>
        )}
      </div>
    </Motion.div>
  );
};

export default CertificationCard;