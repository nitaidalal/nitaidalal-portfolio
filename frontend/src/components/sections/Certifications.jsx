import { useEffect, useState } from "react";
import { certificationService } from "../../services/certification.service";
import CertificationCard from "../cards/CertificationCard";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyState from "../shared/EmptyState";
import PageWrapper from "../layout/PageWrapper";
import { HiOutlineBadgeCheck } from "react-icons/hi";

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCerts = () => {
    setLoading(true);
    certificationService
      .getAll()
      .then((res) => setCerts(res.data))
      .catch(() => setError("Failed to load certifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  return (
    <section id="certifications" className="py-24 bg-background">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="Certifications"
            title="Credentials & Courses"
            subtitle="Verified skills and completed learning paths"
          />

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={fetchCerts} />}

          {!loading && !error && certs.length === 0 && (
            <EmptyState
              icon={HiOutlineBadgeCheck}
              title="No certifications yet"
              message="Certifications will appear here once added"
            />
          )}

          {!loading && !error && certs.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2
                            md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {certs.map((cert) => (
                <CertificationCard key={cert._id} cert={cert} />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default Certifications;
