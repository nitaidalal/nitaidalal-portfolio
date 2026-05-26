import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Languages", "Frameworks", "Databases", "Tools", "Devops"],
    },

    // slug from https://devicons.dev — e.g. "react", "nodejs", "mongodb"
    iconSlug: {
      type: String,
      default: "",
    },

    proficiencyPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, "Proficiency percentage is required"],
    },

    skillOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
