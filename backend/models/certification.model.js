import { Schema, model } from "mongoose";

const certificationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Certification title is required"],
      trim: true,
    },

    issuer: {
      type: String, // e.g. "Coursera", "Udemy", "AWS"
      required: [true, "Issuer is required"],
      trim: true,
    },

    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    verificationUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Certification = model("Certification", certificationSchema);
export default Certification;