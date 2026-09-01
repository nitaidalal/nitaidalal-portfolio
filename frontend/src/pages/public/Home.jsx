import Hero from "../../components/sections/Hero";
import About from "../../components/sections/About";
import FeaturedProjects from "../../components/sections/FeaturedProjects";
import Skills from "../../components/sections/Skills";
import Education from "../../components/sections/Education";
import Certifications from "../../components/sections/Certifications";
import Achievements from "../../components/sections/Achievements";
import Contact from "../../components/sections/Contact";
import GitHubActivity from "@/components/sections/GitHubActivity";
import LeetCodeStats from "@/components/sections/LeetCodeStats";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { profileService } from "@/services/profile.service";

const Home = () => {

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, []);

  const title = profile?.metaTitle || "Nitai Dalal — Full Stack Developer";

  const description =
    profile?.metaDescription ||
    "Portfolio of Nitai Dalal, a Full Stack Developer and B.Tech CSE student specializing in JavaScript, React, Node.js, MongoDB and modern web technologies.";

  const image = profile?.avatarUrl || "";
  return (
    <>
      <Helmet>
        {/* ───────────── Basic SEO ───────────── */}
        <title>{title}</title>

        <meta name="description" content={description} />

        <meta
          name="keywords"
          content="Nitai Dalal, Full Stack Developer, MERN Developer, React Developer, Node.js Developer, JavaScript Developer, Web Developer, Portfolio"
        />

        <meta name="author" content="Nitai Dalal" />

        <meta name="robots" content="index, follow" />

        {/* ───────────── Open Graph ───────────── */}
        <meta property="og:type" content="website" />

        <meta property="og:title" content={title} />

        <meta property="og:description" content={description} />

        <meta property="og:image" content={image} />

        <meta property="og:site_name" content="Nitai Dalal" />

        {/* ───────────── Twitter / X ───────────── */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content={title} />

        <meta name="twitter:description" content={description} />

        <meta name="twitter:image" content={image} />

        {/* ───────────── Canonical URL ───────────── */}
        <link rel="canonical" href="https://your-domain.vercel.app/" />
      </Helmet>
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
      <Education />
      <Certifications />
      <Achievements />
      <LeetCodeStats />
      <GitHubActivity />
      <Contact />
    </>
  );
};

export default Home;
