import mongoose, { Schema } from "mongoose";

const OfferBannerSchema = new Schema(
  {
    image: { type: String, required: true },
    fileId: { type: String },
    isVisible: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const OfferBanner =
  mongoose.models.OfferBanner ??
  mongoose.model("OfferBanner", OfferBannerSchema);
