import mongoose from "mongoose";
import { fi } from "zod/v4/locales";

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["School", "College"],
      required: [true, "Type is required"],
    },

    startYear: {
      type: Number,
      required: [true, "Start year is required"],
    },

    endYear: {
      type: Number,
      default: null, // null = still studying
    },

    order: {
      type: Number,
      default: 0,
    },

    //--------------for college----------------

    degree: {
      type: String,
      trim: true,
      default: "",
    },

    branch: {
      type: String, // "Computer Science & Engineering"
      default: "",
    },

    currentYear: {
      type: String, // "3rd Year"
      default: "",
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },


    //--------------for school----------------

    board: {
      type: String, 
      trim: true,
      default: "",
    },

    percentage: {
      type: Number,
      min: 0,   
        max: 100,
        default: null,
    },

    class: {
      type: String, // "10th", "12th"
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);  


const Education = mongoose.model("Education", educationSchema);
export default Education;