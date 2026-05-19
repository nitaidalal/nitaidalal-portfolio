import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
    },

    // "Hackathon", "Open Source", "Academic", "Competition", "Other"
    category: {
      type: String,
      enum: ["Hackathon", "Open Source", "Academic", "Competition", "Other"],
      default: "Other",
    },

    imageUrl: {
      type: String, // trophy/badge image — Cloudinary
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    link: {
      type: String, // proof link — LinkedIn post, article, etc.
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
