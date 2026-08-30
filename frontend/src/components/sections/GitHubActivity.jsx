import { motion as Motion } from "framer-motion";
import { GitHubCalendar } from "react-github-calendar";
import { FaGithub } from "react-icons/fa";
import SectionHeading from "../shared/SectionHeading";
import PageWrapper    from "../layout/PageWrapper";
import useTheme       from "../../hooks/useTheme";

const GITHUB_USERNAME = "nitaidalal";

const GitHubActivity = () => {
  const { appearance } = useTheme();
  const isDark = appearance === "dark";

  const calendarTheme = {
    light: [
      "var(--muted)",
      "var(--accent)",
      "color-mix(in srgb, var(--primary) 55%, var(--card))",
      "color-mix(in srgb, var(--primary) 75%, var(--card))",
      "var(--primary)",
    ],
    dark: [
      "var(--muted)",
      "var(--accent)",
      "color-mix(in srgb, var(--primary) 55%, var(--card))",
      "color-mix(in srgb, var(--primary) 75%, var(--card))",
      "var(--primary)",
    ],
  };

  return (
    <section id="github" className="py-24 bg-muted/30">
      <PageWrapper>
        <div className="flex flex-col gap-12">
          <SectionHeading
            label="GitHub"
            title="Code Activity"
            subtitle="My open source contributions and coding consistency"
          />

          {/* ── Contribution calendar ─────────────── */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6
                       hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl bg-accent flex items-center
                                justify-center"
                >
                  <FaGithub className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Contribution Graph
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last 12 months of activity
                  </p>
                </div>
              </div>

              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold
                           text-primary hover:underline"
              >
                <FaGithub />@{GITHUB_USERNAME}
              </a>
            </div>

            {/* Calendar */}
            <div className="overflow-x-auto">
              <GitHubCalendar
                username={GITHUB_USERNAME}
                theme={calendarTheme}
                colorScheme={isDark ? "dark" : "light"}
                blockSize={13}
                blockMargin={4}
                fontSize={12}
                style={{
                  color: "var(--foreground-soft)",
                  minWidth: "min-content",
                }}
              />
            </div>
          </Motion.div>

          {/* ── GitHub streak stats ───────────────── */}
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex justify-center"
          >
            <div
              className="bg-card border border-border rounded-2xl p-1
                            hover:border-primary/30 hover:shadow-sm
                            transition-all duration-300 overflow-hidden
                            w-full max-w-lg"
            >
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${GITHUB_USERNAME}&hide_border=true&background=00000000&ring=${isDark ? "4a90d9" : "2563a8"}&fire=${isDark ? "e8874a" : "c96a20"}&currStreakLabel=${isDark ? "c0c0c0" : "3a3a3a"}&sideLabels=${isDark ? "c0c0c0" : "3a3a3a"}&dates=${isDark ? "8888a0" : "71717a"}&currStreakNum=${isDark ? "f0f0f0" : "1a1a1a"}&sideNums=${isDark ? "f0f0f0" : "1a1a1a"}`}
                alt="GitHub Streak"
                draggable="false"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </Motion.div>
        </div>
      </PageWrapper>
    </section>
  );
};

export default GitHubActivity;