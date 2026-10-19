"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadGalleryImage } from "@/lib/imagekit";
import { GalleryImage } from "@/lib/models/GalleryImage";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import { galleryFieldsSchema, parseWithZod } from "@/lib/validation";

export type GalleryImageRecord = {
  id: string;
  image: string;
  fileId?: string;
  caption: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

function refreshGallery() {
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/dashboard");
  revalidatePath("/sitemap");
  revalidatePath("/sitemap.xml");
}

function readFields(formData: FormData) {
  return parseWithZod(galleryFieldsSchema, {
    caption: String(formData.get("caption") ?? ""),
    isActive: formData.get("isActive") === "on",
  });
}

function normalizeGalleryImage(row: GalleryImageRecord): GalleryImageRecord {
  return {
    ...row,
    caption: row.caption ?? "",
    isActive: row.isActive !== false,
    sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : 100,
  };
}

const gallerySort = { sortOrder: 1 as const, createdAt: -1 as const };

/** Active images for the public gallery page (safe fallback to []). */
export async function listPublishedGallery(): Promise<GalleryImageRecord[]> {
  try {
    if (!process.env.MONGODB_URI) return [];
    await dbConnect();
    const rows = await GalleryImage.find({ isActive: { $ne: false } })
      .sort(gallerySort)
      .lean();
    return rows.map((row) =>
      normalizeGalleryImage(serializeDoc<GalleryImageRecord>(row)),
    );
  } catch {
    return [];
  }
}

export async function listGallery(): Promise<GalleryImageRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await GalleryImage.find().sort(gallerySort).lean();
  return rows.map((row) =>
    normalizeGalleryImage(serializeDoc<GalleryImageRecord>(row)),
  );
}

/** Add a gallery image — image file is required (images only). */
export async function createGalleryImage(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadGalleryImage(imageFile);
  if (!url) throw new Error("Image is required");

  await dbConnect();
  const last = await GalleryImage.findOne()
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();
  const nextOrder =
    typeof last?.sortOrder === "number"
      ? last.sortOrder + 1
      : await GalleryImage.countDocuments();

  await GalleryImage.create({
    ...fields,
    image: url,
    fileId,
    sortOrder: nextOrder,
  });
  refreshGallery();
}

export async function updateGalleryImage(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);

  await dbConnect();
  const existing = await GalleryImage.findById(id);
  if (!existing) throw new Error("Gallery image not found");

  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadGalleryImage(imageFile, existing.image);

  if (fileId && existing.fileId && fileId !== existing.fileId) {
    await deleteImage(existing.fileId as string);
  }

  existing.set({
    ...fields,
    image: url,
    fileId: fileId ?? existing.fileId,
  });
  await existing.save();
  refreshGallery();
}

export async function toggleGalleryActive(id: string, isActive: boolean) {
  await requireAdmin();
  await dbConnect();
  await GalleryImage.findByIdAndUpdate(id, { isActive });
  refreshGallery();
}

/** Move a gallery image up/down — website order updates after revalidate. */
export async function moveGalleryImage(id: string, direction: "up" | "down") {
  await requireAdmin();
  await dbConnect();

  const rows = await GalleryImage.find().sort(gallerySort).lean();
  const index = rows.findIndex((row) => String(row._id) === id);
  if (index < 0) throw new Error("Gallery image not found");

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const ordered = [...rows];
  [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];

  await Promise.all(
    ordered.map((row, i) =>
      GalleryImage.findByIdAndUpdate(row._id, { sortOrder: i }),
    ),
  );

  refreshGallery();
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await GalleryImage.findById(id);
  if (!existing) throw new Error("Gallery image not found");

  await deleteImage(existing.fileId as string | undefined);
  await GalleryImage.findByIdAndDelete(id);
  refreshGallery();
}
