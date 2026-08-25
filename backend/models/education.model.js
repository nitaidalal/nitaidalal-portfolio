import mongoose from "mongoose";


const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["College", "School"],
      required: true,
    },

    // College only
    startYear: {
      type: Number,
    },

    endYear: {
      type: Number,
      default: null,
    },

    // School only — passing year
    passingYear: {
      type: Number,
    },

    degree: {
      type: String,
      trim: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    currentYear: {
      type: String,
      trim: true,
    },

    cgpa: {
      type: Number,
    },

    board: {
      type: String,
      trim: true,
    },

    percentage: {
      type: Number,
    },

    standard: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);


const Education = mongoose.model("Education", educationSchema);
export default Education;