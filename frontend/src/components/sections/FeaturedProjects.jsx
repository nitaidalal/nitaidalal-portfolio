import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { projectService } from "../../services/project.service";
import ProjectCard from "../cards/ProjectCard";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyState from "../shared/EmptyState";
import PageWrapper from "../layout/PageWrapper";
import { TbCode } from "react-icons/tb";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    projectService
      .getFeatured()
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-24 bg-muted/30">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          {/* Heading + view all */}
          <div
            className="flex flex-col sm:flex-row sm:items-end
                          justify-between gap-4"
          >
            <SectionHeading
              label="Projects"
              title="Featured Work"
              subtitle="Things I've built that I'm proud of"
              align="left"
            />

            <Motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to="/projects"
                className="flex items-center gap-2 text-sm font-semibold
                           text-primary hover:gap-3 transition-all duration-200
                           flex-shrink-0"
              >
                View all projects
                <HiArrowRight />
              </Link>
            </Motion.div>
          </div>

          {/* States */}
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={fetchProjects} />}

          {!loading && !error && projects.length === 0 && (
            <EmptyState
              icon={TbCode}
              title="No featured projects yet"
              message="Check back soon!"
            />
          )}

          {/* Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default FeaturedProjects;
