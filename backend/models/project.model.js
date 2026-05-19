import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Project short description is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    techTags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: ["Full Stack", "Frontend", "Backend", "Mobile", "Machine Learning"],
      default: "Full Stack",
    },

    imageUrl: {
      type: String, // project screenshot — Cloudinary URL
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    liveUrl: {
      type: String,
      trim: true,
    },

    repoUrl: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date, // null means ongoing
    },

    featured: {
      type: Boolean,
      default: false, // featured projects shown first / highlighted
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    categoryOrder: {
      type: Number,
      default: 0, // for drag-to-reorder in admin
    },
  },
  { timestamps: true },
);


const Project = mongoose.model("Project", projectSchema);
export default Project;