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

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
      <Education />
      <Certifications />
      <Achievements />
      <LeetCodeStats />
      <GitHubActivity/>
      <Contact />
    </>
  );
};

export default Home;
