import mongoose, { Schema } from "mongoose";
import { careerRoles } from "@/data/careers";

export const applicationStatuses = [
  "pending",
  "shortlisted",
  "rejected",
] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

const ApplicationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    role: { type: String, enum: careerRoles, required: true },
    resumeUrl: { type: String, required: true },
    resumeFileId: { type: String },
    resumeName: { type: String, required: true },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "pending",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Application =
  mongoose.models.Application ??
  mongoose.model("Application", ApplicationSchema);
