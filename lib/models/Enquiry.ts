import mongoose, { Schema } from "mongoose";

export const enquiryStatuses = ["pending", "followup", "resolved"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    event: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    source: {
      type: String,
      enum: ["contact", "popup"],
      required: true,
    },
    status: {
      type: String,
      enum: enquiryStatuses,
      default: "pending",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Enquiry =
  mongoose.models.Enquiry ?? mongoose.model("Enquiry", EnquirySchema);