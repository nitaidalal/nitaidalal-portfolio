import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },

    // groups skills into sections on portfolio
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Languages", "Frameworks", "Databases", "Tools", "Other"],
    },

    categoryOrder: {
      type: Number,
      default: 0, // Controls which category appears first
    },

    // slug from https://devicons.dev — e.g. "react", "nodejs", "mongodb"
    iconSlug: {
      type: String,
      default: "",
    },

    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
