"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "@/lib/imagekit";
import { Service } from "@/lib/models/Service";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import { parseWithZod, serviceFieldsSchema } from "@/lib/validation";

export type ServiceRecord = {
  id: string;
  name: string;
  image: string;
  fileId?: string;
  description: string;
  isActive: boolean;
};

function isActiveValue(value: unknown) {
  return value !== false;
}

function readFields(formData: FormData) {
  return parseWithZod(serviceFieldsSchema, {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    isActive: formData.get("isActive") === "on",
  });
}

function refreshServicePages() {
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/sitemap");
  revalidatePath("/admin/services");
  revalidatePath("/admin/dashboard");
}

export async function listPublishedServices(): Promise<ServiceRecord[]> {
  try {
    if (!process.env.MONGODB_URI) return [];
    await dbConnect();
    const rows = await Service.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).lean();
    return rows.map((row) => serializeDoc<ServiceRecord>(row));
  } catch {
    return [];
  }
}

export async function listServices(): Promise<ServiceRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Service.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => {
    const item = serializeDoc<ServiceRecord>(row);
    return { ...item, isActive: isActiveValue(item.isActive) };
  });
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireAdmin();
  await dbConnect();
  await Service.findByIdAndUpdate(id, { isActive });
  refreshServicePages();
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(imageFile, "services", "service");
  if (!url) throw new Error("Image is required");

  await dbConnect();
  await Service.create({ ...fields, image: url, fileId, isActive: fields.isActive });
  refreshServicePages();
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  await dbConnect();
  const existing = await Service.findById(id);
  if (!existing) throw new Error("Service not found");

  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(
    imageFile,
    "services",
    "service",
    existing.image,
  );

  if (fileId && existing.fileId && fileId !== existing.fileId) {
    await deleteImage(existing.fileId);
  }

  existing.set({
    ...fields,
    image: url,
    fileId: fileId ?? existing.fileId,
    isActive: fields.isActive,
  });
  await existing.save();
  refreshServicePages();
}

export async function deleteService(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await Service.findById(id);
  if (!existing) throw new Error("Service not found");

  await deleteImage(existing.fileId);
  await Service.findByIdAndDelete(id);
  refreshServicePages();
}
