import mongoose, { Schema } from "mongoose";
import { adminFoodCategories } from "@/data/food";

const FoodSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: adminFoodCategories,
    },
    image: { type: String, required: true },
    fileId: { type: String },
    description: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Food = mongoose.models.Food ?? mongoose.model("Food", FoodSchema);

if (!Food.schema.path("isActive")) {
  Food.schema.add({ isActive: { type: Boolean, default: true } });
}
