import { useEffect, useState } from "react";
import { achievementService } from "../../services/achievement.service";
import AchievementCard from "../cards/AchievementCard";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorMessage from "../shared/ErrorMessage";
import EmptyState from "../shared/EmptyState";
import PageWrapper from "../layout/PageWrapper";
import { FaTrophy } from "react-icons/fa";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAchievements = () => {
    setLoading(true);
    achievementService
      .getAll()
      .then((res) => setAchievements(res.data))
      .catch(() => setError("Failed to load achievements"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <section id="achievements" className="py-24 bg-muted/30">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="Achievements"
            title="Wins & Highlights"
            subtitle="Competitions, contributions, and milestones"
          />

          {loading && <LoadingSpinner />}
          {error && (
            <ErrorMessage message={error} onRetry={fetchAchievements} />
          )}

          {!loading && !error && achievements.length === 0 && (
            <EmptyState
              icon={FaTrophy}
              title="No achievements yet"
              message="Achievements will appear here once added"
            />
          )}

          {!loading && !error && achievements.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2
                            md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default Achievements;
