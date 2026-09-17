"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "@/lib/imagekit";
import { Service } from "@/lib/models/Service";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import { resolveSlug } from "@/lib/slug";
import { parseWithZod, serviceFieldsSchema } from "@/lib/validation";

export type ServiceRecord = {
  id: string;
  name: string;
  slug: string;
  image: string;
  fileId?: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
};

function isActiveValue(value: unknown) {
  return value !== false;
}

function readFields(formData: FormData) {
  return parseWithZod(serviceFieldsSchema, {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    metaTitle: String(formData.get("metaTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    metaKeywords: String(formData.get("metaKeywords") ?? ""),
    isActive: formData.get("isActive") === "on",
  });
}

function normalizeService(row: ServiceRecord): ServiceRecord {
  return {
    ...row,
    slug: row.slug || resolveSlug("", row.name),
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
    metaKeywords: row.metaKeywords ?? "",
    isActive: isActiveValue(row.isActive),
  };
}

async function assertUniqueServiceSlug(slug: string, excludeId?: string) {
  const query = excludeId
    ? { slug, _id: { $ne: excludeId } }
    : { slug };
  const existing = await Service.findOne(query).lean();
  if (existing) throw new Error("This slug is already used by another service");
}

function refreshServicePages(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/services");
  if (slug) revalidatePath(`/services/${slug}`);
  revalidatePath("/sitemap");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/services");
  revalidatePath("/admin/dashboard");
}

export async function listPublishedServices(
  limit?: number,
): Promise<ServiceRecord[]> {
  try {
    if (!process.env.MONGODB_URI) return [];
    await dbConnect();
    let query = Service.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
    if (limit && limit > 0) query = query.limit(limit);
    const rows = await query.lean();
    return rows.map((row) => normalizeService(serializeDoc<ServiceRecord>(row)));
  } catch {
    return [];
  }
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<ServiceRecord | null> {
  try {
    if (!process.env.MONGODB_URI || !slug) return null;
    await dbConnect();
    const bySlug = await Service.findOne({ slug, isActive: { $ne: false } }).lean();
    if (bySlug) return normalizeService(serializeDoc<ServiceRecord>(bySlug));

    // Legacy docs may not have slug stored yet — match from name.
    const rows = await Service.find({ isActive: { $ne: false } }).lean();
    for (const row of rows) {
      const item = normalizeService(serializeDoc<ServiceRecord>(row));
      if (item.slug === slug) return item;
    }
    return null;
  } catch {
    return null;
  }
}

export async function listServices(): Promise<ServiceRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Service.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => normalizeService(serializeDoc<ServiceRecord>(row)));
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await requireAdmin();
  await dbConnect();
  const existing = await Service.findByIdAndUpdate(id, { isActive }, { new: true });
  refreshServicePages(existing?.slug);
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const slug = resolveSlug(fields.slug, fields.name);
  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(imageFile, "services", "service");
  if (!url) throw new Error("Image is required");

  await dbConnect();
  await assertUniqueServiceSlug(slug);
  await Service.create({
    ...fields,
    slug,
    image: url,
    fileId,
    isActive: fields.isActive,
  });
  refreshServicePages(slug);
}

export async function updateService(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const slug = resolveSlug(fields.slug, fields.name);

  await dbConnect();
  const existing = await Service.findById(id);
  if (!existing) throw new Error("Service not found");

  await assertUniqueServiceSlug(slug, id);

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

  const previousSlug = existing.slug as string | undefined;

  existing.set({
    ...fields,
    slug,
    image: url,
    fileId: fileId ?? existing.fileId,
    isActive: fields.isActive,
  });
  await existing.save();
  refreshServicePages(slug);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/services/${previousSlug}`);
  }
}

export async function deleteService(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await Service.findById(id);
  if (!existing) throw new Error("Service not found");

  const slug = existing.slug as string | undefined;
  await deleteImage(existing.fileId);
  await Service.findByIdAndDelete(id);
  refreshServicePages(slug);
}
