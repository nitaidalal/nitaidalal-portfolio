import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { SiLeetcode } from "react-icons/si";
import { BsLightningCharge } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";
import leetcodeService  from "../../services/leetcode.service";
import SectionHeading  from "../shared/SectionHeading";
import PageWrapper     from "../layout/PageWrapper";
import LoadingSpinner  from "../shared/LoadingSpinner";
import useTheme from "../../hooks/useTheme";

const LEETCODE_USERNAME = "nitai_dalal_01"; 

// ─── Difficulty ring ──────────────────────────────────
const DifficultyRing = ({ label, solved, total, color, delay }) => {
  const percentage  = total > 0 ? (solved / total) * 100 : 0;
  const radius      = 28;
  const circumference= 2 * Math.PI * radius;
  const strokeDash  = (percentage / 100) * circumference;

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-3"
    >
      {/* Ring */}
      <div className="relative w-20 h-20">
        <svg
          width="80" height="80"
          viewBox="0 0 80 80"
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="7"
          />
          {/* Progress ring */}
          <Motion.circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - strokeDash }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center
                        justify-center">
          <span className="text-lg font-extrabold text-foreground leading-none">
            {solved}
          </span>
          <span className="text-xs text-muted-foreground">{`/${total}`}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground">
          {percentage.toFixed(0)}% solved
        </span>
      </div>
    </Motion.div>
  );
};

const StatItem = ({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBackground,
  appearance,
  delay,
}) => (
  <Motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="bg-card border border-border rounded-xl p-4
               flex items-center gap-4 hover:border-primary/30
               transition-all duration-300"
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center
                 flex-shrink-0"
      style={{ backgroundColor: iconBackground[appearance] }}
    >
      <Icon className="text-lg" style={{ color: iconColor }} />
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-extrabold text-foreground leading-none">
        {value ?? "—"}
      </span>
      <span className="text-xs text-muted-foreground font-medium mt-0.5">
        {label}
      </span>
    </div>
  </Motion.div>
);

const LeetCodeStats = () => {
  const { appearance } = useTheme();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    leetcodeService
      .getStats(LEETCODE_USERNAME)
      .then((res) => setStats(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="leetcode" className="py-24 bg-background">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="DSA"
            title="LeetCode Stats"
            subtitle="Consistent problem solving — my DSA journey on LeetCode"
          />

          {loading && <LoadingSpinner />}

          {error && (
            <div className="text-center text-muted-foreground text-sm py-8">
              Could not load LeetCode stats right now. Check back soon!
            </div>
          )}

          {!loading && !error && stats && (
            <div className="flex flex-col gap-8">
              {/* ── Top row: total + ranking ─────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatItem
                  icon={SiLeetcode}
                  iconColor="#ffa116"
                  iconBackground={{ light: "#fff1d6", dark: "#4a2f0b" }}
                  appearance={appearance}
                  label="Total Solved"
                  value={stats.totalSolved}
                  delay={0.05}
                />
                <StatItem
                  icon={FaTrophy}
                  iconColor="#f5b700"
                  iconBackground={{ light: "#fff8d6", dark: "#493d08" }}
                  appearance={appearance}
                  label="Global Ranking"
                  value={
                    stats.ranking ? `#${stats.ranking.toLocaleString()}` : "N/A"
                  }
                  delay={0.1}
                />
                <StatItem
                  icon={BsLightningCharge}
                  iconColor="#f59e0b"
                  iconBackground={{ light: "#ffead1", dark: "#4b260b" }}
                  appearance={appearance}
                  label="Contest Rating"
                  value={stats.contestRating ?? "N/A"}
                  delay={0.15}
                />
              </div>

              {/* ── Main card: rings + breakdown ─── */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6
                           sm:p-8 hover:border-primary/30
                           transition-all duration-300"
              >
                <div
                  className="flex flex-col sm:flex-row items-center
                                gap-8 sm:gap-12"
                >
                  {/* Rings */}
                  <div
                    className="flex items-center gap-8 sm:gap-10
                                  flex-shrink-0"
                  >
                    <DifficultyRing
                      label="Easy"
                      solved={stats.easySolved}
                      total={stats.totalEasy}
                      color="#00b8a3"
                      delay={0.2}
                    />
                    <DifficultyRing
                      label="Medium"
                      solved={stats.mediumSolved}
                      total={stats.totalMedium}
                      color="#ffc01e"
                      delay={0.3}
                    />
                    <DifficultyRing
                      label="Hard"
                      solved={stats.hardSolved}
                      total={stats.totalHard}
                      color="#ef4743"
                      delay={0.4}
                    />
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px self-stretch bg-border" />
                  <div className="sm:hidden w-full h-px bg-border" />

                  {/* Right side breakdown */}
                  <div className="flex flex-col gap-4 flex-1 w-full">
                    {/* Total progress bar */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">
                          Overall Progress
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {stats.totalSolved} /{" "}
                          {stats.totalEasy +
                            stats.totalMedium +
                            stats.totalHard}
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <Motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(stats.totalSolved / (stats.totalEasy + stats.totalMedium + stats.totalHard)) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.2,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>

                    {/* Per-difficulty bars */}
                    {[
                      {
                        label: "Easy",
                        solved: stats.easySolved,
                        total: stats.totalEasy,
                        color: "#00b8a3",
                      },
                      {
                        label: "Medium",
                        solved: stats.mediumSolved,
                        total: stats.totalMedium,
                        color: "#ffc01e",
                      },
                      {
                        label: "Hard",
                        solved: stats.hardSolved,
                        total: stats.totalHard,
                        color: "#ef4743",
                      },
                    ].map(({ label, solved, total, color }, i) => (
                      <div key={label} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <span
                            className="text-xs font-semibold"
                            style={{ color }}
                          >
                            {label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {solved} / {total}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <Motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${total > 0 ? (solved / total) * 100 : 0}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: 0.3 + i * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile link */}
                <div
                  className="flex items-center justify-between
                                mt-6 pt-5 border-t border-border"
                >
                  <div className="flex items-center gap-2">
                    <SiLeetcode className="text-[#ffc01e] text-lg" />
                    <span className="text-sm font-medium text-foreground">
                      @{LEETCODE_USERNAME}
                    </span>
                  </div>
                  <a
                    href={`https://leetcode.com/${LEETCODE_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary
                               hover:underline flex items-center gap-1"
                  >
                    View Profile →
                  </a>
                </div>
              </Motion.div>
            </div>
          )}
        </div>
      </PageWrapper>
    </section>
  );
};

export default LeetCodeStats;