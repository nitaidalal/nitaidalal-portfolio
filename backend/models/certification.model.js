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

  credential: {
    type: {
      enum: ["url", "file"],
      required: true,
    },
    value: String, // URL (online link or Cloudinary file URL)
    id: String, // credential ID for online verification or Cloudinary public ID
  },

  order: {
    type: Number,
    default: 0, // controls display order on portfolio
  },
},
{ timestamps: true }
);

const Certification = model("Certification", certificationSchema);
export default Certification;