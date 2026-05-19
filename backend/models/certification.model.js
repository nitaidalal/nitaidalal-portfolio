import { Schema, model } from "mongoose";

const certificationSchema = new Schema({
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

  credentialUrl: {
    type: String,
    default: "",
  },

  order: {
    type: Number,
    default: 0, 
  },
},
{ timestamps: true }
);

const Certification = model("Certification", certificationSchema);
export default Certification;