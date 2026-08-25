import { useEffect, useState } from "react";
import { educationService } from "../../services/education.service";
import EducationCard from "../cards/EducationCard";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";
import PageWrapper from "../layout/PageWrapper";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEducation = () => {
    setLoading(true);
    educationService
      .getAll()
      .then((res) => setEducation(res.data))
      .catch(() => setError("Failed to load education"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  return (
    <section id="education" className="py-24 bg-muted/30">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="Education"
            title="My Academic Journey"
            subtitle="Where I studied and what I achieved"
          />

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={fetchEducation} />}

          {!loading && !error && (
            <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
              {education.map((edu) => (
                <EducationCard key={edu._id} education={edu} />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default Education;
