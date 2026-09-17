"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "@/lib/imagekit";
import { Food } from "@/lib/models/Food";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import { foodFieldsSchema, parseWithZod } from "@/lib/validation";

export type FoodRecord = {
  id: string;
  name: string;
  category: string;
  image: string;
  fileId?: string;
  description: string;
  isActive: boolean;
};

function isActiveValue(value: unknown) {
  return value !== false;
}

function readFields(formData: FormData) {
  return parseWithZod(foodFieldsSchema, {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? ""),
    isActive: formData.get("isActive") === "on",
  });
}

function refreshFoodPages() {
  revalidatePath("/", "layout");
  revalidatePath("/gallery");
  revalidatePath("/sitemap");
  revalidatePath("/admin/food");
  revalidatePath("/admin/dashboard");
}

export async function listPublishedFoods(): Promise<FoodRecord[]> {
  try {
    if (!process.env.MONGODB_URI) return [];
    await dbConnect();
    const rows = await Food.find({ isActive: { $ne: false } }).sort({ createdAt: -1 }).lean();
    return rows.map((row) => serializeDoc<FoodRecord>(row));
  } catch {
    return [];
  }
}

export async function listFoods(): Promise<FoodRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Food.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => {
    const item = serializeDoc<FoodRecord>(row);
    return { ...item, isActive: isActiveValue(item.isActive) };
  });
}

export async function toggleFoodActive(id: string, isActive: boolean) {
  await requireAdmin();
  await dbConnect();
  await Food.findByIdAndUpdate(id, { isActive });
  refreshFoodPages();
}

export async function createFood(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(imageFile, "food", "food");
  if (!url) throw new Error("Image is required");

  await dbConnect();
  await Food.create({ ...fields, image: url, fileId, isActive: fields.isActive });
  refreshFoodPages();
}

export async function updateFood(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  await dbConnect();
  const existing = await Food.findById(id);
  if (!existing) throw new Error("Food not found");

  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(imageFile, "food", "food", existing.image);

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
  refreshFoodPages();
}

export async function deleteFood(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await Food.findById(id);
  if (!existing) throw new Error("Food not found");

  await deleteImage(existing.fileId);
  await Food.findByIdAndDelete(id);
  refreshFoodPages();
}
