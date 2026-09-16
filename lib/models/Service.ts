import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    fileId: { type: String },
    description: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Service = mongoose.models.Service ?? mongoose.model("Service", ServiceSchema);

if (!Service.schema.path("isActive")) {
  Service.schema.add({ isActive: { type: Boolean, default: true } });
}
