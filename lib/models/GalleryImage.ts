import mongoose, { Schema } from "mongoose";

const GalleryImageSchema = new Schema(
  {
    image: { type: String, required: true },
    fileId: { type: String },
    caption: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    /** Lower number shows first on the website */
    sortOrder: { type: Number, default: 100, index: true },
  },
  { timestamps: true },
);

export const GalleryImage =
  mongoose.models.GalleryImage ??
  mongoose.model("GalleryImage", GalleryImageSchema);
