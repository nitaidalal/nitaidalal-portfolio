import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  FaGithub, FaExternalLinkAlt, FaArrowLeft,
} from "react-icons/fa";
import { BsCalendar3, BsTag } from "react-icons/bs";
import { MdOutlineCategory } from "react-icons/md";
import { HiOutlineCode } from "react-icons/hi";
import { projectService }   from "../../services/project.service";
import { skillService }     from "../../services/skill.service";
import LoadingSpinner       from "../../components/shared/LoadingSpinner";
import ErrorMessage         from "../../components/shared/ErrorMessage";
import PageWrapper          from "../../components/layout/PageWrapper";
import { formatMonthYear }  from "../../utils/formatDate";

// ─── Tech tag with devicon ────────────────────────────
const TechTag = ({ tag, skills = [] }) => {
  // try to find matching skill for icon
  const matchedSkill = skills.find(
    (s) => s.name.toLowerCase() === tag.toLowerCase()
  );

  return (
    <Motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl
                 bg-card border border-border
                 hover:border-primary/40 hover:bg-accent
                 transition-all duration-200"
    >
      {matchedSkill?.iconSlug && (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${matchedSkill.iconSlug}/${matchedSkill.iconSlug}-original.svg`}
          alt={tag}
          className="w-5 h-5 object-contain"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}
      <span className="text-sm font-medium text-foreground">{tag}</span>
    </Motion.div>
  );
};

// ─── Info badge ───────────────────────────────────────
const InfoBadge = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1.5 bg-card border border-border
                  rounded-xl px-4 py-3">
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground
                    font-semibold uppercase tracking-wider">
      <Icon className="text-primary" />
      {label}
    </div>
    <p className="text-sm font-bold text-foreground">{value}</p>
  </div>
);

const ProjectDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [project, setProject] = useState(null);
  const [skills,  setSkills]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectRes, skillsRes] = await Promise.all([
          projectService.getById(id),
          skillService.getAll(),
        ]);
        setProject(projectRes.data);
        setSkills(skillsRes.data.skills || []);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Project not found"
            : "Failed to load project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error)   return (
    <div className="min-h-screen bg-background flex flex-col
                    items-center justify-center gap-4">
      <ErrorMessage message={error} />
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-sm font-medium
                   text-primary hover:underline"
      >
        <FaArrowLeft className="text-xs" />
        Back to Projects
      </button>
    </div>
  );

  if (!project) return null;

  const {
    title,
    shortDescription,
    description,
    techTags   = [],
    category,
    imageUrl,
    liveUrl,
    repoUrl,
    startDate,
    endDate,
    isFeatured,
  } = project;

  const containerVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <PageWrapper>
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-10"
        >

          {/* ── Back button ────────────────────────── */}
          <Motion.div variants={itemVariants}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium
                         text-muted-foreground hover:text-primary
                         transition-colors duration-200 group"
            >
              <FaArrowLeft
                className="text-xs group-hover:-translate-x-1
                           transition-transform duration-200"
              />
              Back to Projects
            </Link>
          </Motion.div>

          {/* ── Hero image ─────────────────────────── */}
          {imageUrl && (
            <Motion.div
              variants={itemVariants}
              className="w-full aspect-video rounded-2xl overflow-hidden
                         bg-muted border border-border shadow-sm"
            >
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </Motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Left: main content (2/3) ─────────── */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Title + badges */}
              <Motion.div
                variants={itemVariants}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1
                                   rounded-full bg-accent text-accent-foreground
                                   border border-border">
                    {category}
                  </span>
                  {isFeatured && (
                    <span className="text-xs font-semibold px-3 py-1
                                     rounded-full bg-primary/10 text-primary">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold
                               text-foreground leading-tight tracking-tight">
                  {title}
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {shortDescription}
                </p>
              </Motion.div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Full description */}
              {description && (
                <Motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-3"
                >
                  <h2 className="text-lg font-bold text-foreground
                                 flex items-center gap-2">
                    <HiOutlineCode className="text-primary" />
                    About this project
                  </h2>
                  <div className="text-muted-foreground leading-relaxed
                                  flex flex-col gap-3">
                    {description.split("\n").map((para, i) =>
                      para.trim() ? (
                        <p key={i}>{para}</p>
                      ) : null
                    )}
                  </div>
                </Motion.div>
              )}

              {/* Tech stack */}
              {techTags.length > 0 && (
                <Motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-lg font-bold text-foreground
                                 flex items-center gap-2">
                    <BsTag className="text-primary" />
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {techTags.map((tag) => (
                      <TechTag key={tag} tag={tag} skills={skills} />
                    ))}
                  </div>
                </Motion.div>
              )}
            </div>

            {/* ── Right: sidebar (1/3) ─────────────── */}
            <Motion.div
              variants={itemVariants}
              className="flex flex-col gap-4"
            >

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2
                               w-full px-5 py-3 rounded-xl bg-primary
                               text-primary-foreground font-semibold text-sm
                               hover:opacity-90 transition-opacity duration-200
                               shadow-sm"
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
                    className="flex items-center justify-center gap-2
                               w-full px-5 py-3 rounded-xl bg-card
                               border border-border text-foreground
                               font-semibold text-sm hover:bg-accent
                               hover:border-primary/30 transition-all duration-200"
                  >
                    <FaGithub className="text-base" />
                    View Source
                  </a>
                )}

                {!liveUrl && !repoUrl && (
                  <div className="w-full px-5 py-3 rounded-xl bg-muted
                                  text-muted-foreground text-sm text-center
                                  border border-border">
                    Links coming soon
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Project info */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-muted-foreground
                               uppercase tracking-wider">
                  Project Info
                </h3>

                <InfoBadge
                  icon={MdOutlineCategory}
                  label="Category"
                  value={category}
                />

                {startDate && (
                  <InfoBadge
                    icon={BsCalendar3}
                    label="Timeline"
                    value={`${formatMonthYear(startDate)} – ${
                      endDate ? formatMonthYear(endDate) : "Present"
                    }`}
                  />
                )}

                {techTags.length > 0 && (
                  <InfoBadge
                    icon={BsTag}
                    label="Tech Count"
                    value={`${techTags.length} technologies`}
                  />
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Back to all projects */}
              <Link
                to="/projects"
                className="flex items-center justify-center gap-2
                           w-full px-5 py-3 rounded-xl border border-border
                           text-muted-foreground text-sm font-medium
                           hover:bg-accent hover:text-foreground
                           hover:border-primary/30 transition-all duration-200"
              >
                <FaArrowLeft className="text-xs" />
                All Projects
              </Link>
            </Motion.div>
          </div>

          {/* ── Related — other projects in same category ── */}
          <RelatedProjects
            category={category}
            currentId={id}
          />

        </Motion.div>
      </PageWrapper>
    </div>
  );
};

// ─── Related projects ─────────────────────────────────
const RelatedProjects = ({ category, currentId }) => {
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    projectService.getAll(category)
      .then((res) => {
        const filtered = res.data
          .filter((p) => p._id !== currentId)
          .slice(0, 3);
        setRelated(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, currentId]);

  if (loading || related.length === 0) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 pt-6 border-t border-border"
    >
      <h2 className="text-lg font-bold text-foreground">
        More {category} Projects
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {related.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="group bg-card border border-border rounded-2xl
                       overflow-hidden hover:border-primary/30
                       hover:shadow-sm transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-muted overflow-hidden">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-muted-foreground/20">
                    {project.title?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-1.5">
              <h3 className="font-bold text-foreground text-sm
                             group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.shortDescription}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.techTags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full
                               bg-accent text-accent-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Motion.div>
  );
};

export default ProjectDetail;