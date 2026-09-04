import {model,Schema} from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },

    subject: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false, 
    },
    isReplied: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
    replyMessage: { type: String, default: "" },
  },
  { timestamps: true },
);


const Contact = model("Contact",contactSchema); 
export default Contact;