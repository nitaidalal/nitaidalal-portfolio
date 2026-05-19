import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    taglines: {
      type: [String],
      default: [],
    },

    heroSubtitle: {
      type: String, // "I build things for the web"
      trim: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    avatarPublicId: {
      type: String, // Cloudinary public_id — needed to delete old image
      default: "",
    },

    resumeUrl: {
      type: String, // Cloudinary PDF URL
      default: "",
    },

    resumePublicId: {
      type: String, // needed to delete old resume before uploading new
      default: "",
    },

    // ─── About Me ──────────────────────────────────────
    bio: {
      type: String,
      trim: true,
    },

    currentlyLearning: {
      type: String, // "Docker, AWS"
      trim: true,
    },

    currentlyBuilding: {
      type: String, // "My portfolio"
      trim: true,
    },

    funFact: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    // ─── Contact & Socials ─────────────────────────────
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      leetcode: { type: String, default: "" },
    },

    // ─── SEO ───────────────────────────────────────────
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
