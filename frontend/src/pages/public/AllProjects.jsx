import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { projectService } from "../../services/project.service";
import ProjectCard from "../../components/cards/ProjectCard";
import SectionHeading from "../../components/shared/SectionHeading";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ErrorMessage from "../../components/shared/ErrorMessage";
import EmptyState from "../../components/shared/EmptyState";
import PageWrapper from "../../components/layout/PageWrapper";
import { PROJECT_CATEGORIES } from "../../utils/constants";
import { TbCode } from "react-icons/tb";
import SkeletonCard from "../../components/shared/skeletonCard";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    projectService
      .getAll(category)
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, [category]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <PageWrapper>
        <div className="flex flex-col gap-10">
          <SectionHeading
            label="Portfolio"
            title="All Projects"
            subtitle="Everything I've built — filtered by category"
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {PROJECT_CATEGORIES.map((cat) => (
              <Motion.button
                key={cat}
                onClick={() => setCategory(cat)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium
                            border transition-all duration-200 ${
                              category === cat
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                            }`}
              >
                {cat}
              </Motion.button>
            ))}
          </div>

          {/* States */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
          {error && <ErrorMessage message={error} onRetry={fetchProjects} />}

          {!loading && !error && projects.length === 0 && (
            <EmptyState
              icon={TbCode}
              title="No projects found"
              message={`No projects in the "${category}" category yet`}
            />
          )}

          {/* Grid */}
          {!loading && !error && projects.length > 0 && (
            <Motion.div
              key={category}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </Motion.div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default AllProjects;
