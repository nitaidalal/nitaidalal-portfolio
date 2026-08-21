import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/admin.model.js";
import Profile from "./models/profile.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists — skipping");
    } else {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`);
    }

    // ─── Seed Profile ─────────────────────────────────
    const existingProfile = await Profile.findOne();

    if (existingProfile) {
      console.log("⚠️  Profile already exists — skipping");
    } else {
      await Profile.create({
        name: "Nitai Dalal",
        taglines: [
          "Full Stack Developer",
          "MERN Stack Developer",
          "Problem Solver",
        ],
        heroSubtitle: "I build things for the web",
        bio: "I'm a final year B.Tech CSE (AI & ML) student passionate about building full stack web applications.",
        location: "Kolkata, West Bengal",
        currentlyLearning: "Docker, AWS",
        currentlyBuilding: "My developer portfolio",
        funFact: "I solve LeetCode problems in C++",
        email: "nitai@example.com",
        socialLinks: {
          github: "https://github.com/nitaidalal",
          linkedin: "https://linkedin.com/in/nitaidalal",
          leetcode: "https://leetcode.com/nitaidalal",
          twitter: "",
          instagram: "",
        },
        metaTitle: "Nitai Dalal — Full Stack Developer",
        metaDescription:
          "Portfolio of Nitai Dalal, a Full Stack Developer specializing in MERN stack.",
      });
      console.log("✅ Profile created");
    }

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
