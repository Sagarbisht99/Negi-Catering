import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true, index: true },
    image: { type: String, required: true },
    fileId: { type: String },
    description: { type: String, required: true, trim: true },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Service = mongoose.models.Service ?? mongoose.model("Service", ServiceSchema);

if (!Service.schema.path("isActive")) {
  Service.schema.add({ isActive: { type: Boolean, default: true } });
}
if (!Service.schema.path("slug")) {
  Service.schema.add({
    slug: { type: String, trim: true, unique: true, sparse: true, index: true },
  });
}
if (!Service.schema.path("metaTitle")) {
  Service.schema.add({
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    metaKeywords: { type: String, trim: true, default: "" },
  });
}
