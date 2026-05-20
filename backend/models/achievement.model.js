import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
    },

    description:{
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: Date,
    },

    category: {
      type: String,
      trim: true,
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

    proofLink: {
      type: String, // LinkedIn post, article, etc.
      default: "",
    },

  },
  { timestamps: true },
);

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
