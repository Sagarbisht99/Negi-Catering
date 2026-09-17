"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "@/lib/imagekit";
import { Blog } from "@/lib/models/Blog";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import { resolveSlug } from "@/lib/slug";
import { blogFieldsSchema, parseWithZod } from "@/lib/validation";

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  fileId?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function isActiveValue(value: unknown) {
  return value !== false;
}

function readFields(formData: FormData) {
  return parseWithZod(blogFieldsSchema, {
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    metaTitle: String(formData.get("metaTitle") ?? ""),
    metaDescription: String(formData.get("metaDescription") ?? ""),
    metaKeywords: String(formData.get("metaKeywords") ?? ""),
    isActive: formData.get("isActive") === "on",
  });
}

function normalizeBlog(row: BlogRecord): BlogRecord {
  return {
    ...row,
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
    metaKeywords: row.metaKeywords ?? "",
    isActive: isActiveValue(row.isActive),
  };
}

async function assertUniqueBlogSlug(slug: string, excludeId?: string) {
  const query = excludeId
    ? { slug, _id: { $ne: excludeId } }
    : { slug };
  const existing = await Blog.findOne(query).lean();
  if (existing) throw new Error("This slug is already used by another blog");
}

function refreshBlogPages(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blogs");
  revalidatePath("/admin/dashboard");
}

export async function listPublishedBlogs(limit?: number): Promise<BlogRecord[]> {
  try {
    if (!process.env.MONGODB_URI) return [];
    await dbConnect();
    let query = Blog.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
    if (limit && limit > 0) query = query.limit(limit);
    const rows = await query.lean();
    return rows.map((row) => normalizeBlog(serializeDoc<BlogRecord>(row)));
  } catch {
    return [];
  }
}

export async function getPublishedBlogBySlug(
  slug: string,
): Promise<BlogRecord | null> {
  try {
    if (!process.env.MONGODB_URI || !slug) return null;
    await dbConnect();
    const row = await Blog.findOne({ slug, isActive: { $ne: false } }).lean();
    if (!row) return null;
    return normalizeBlog(serializeDoc<BlogRecord>(row));
  } catch {
    return null;
  }
}

export async function listBlogs(): Promise<BlogRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Blog.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => normalizeBlog(serializeDoc<BlogRecord>(row)));
}

export async function toggleBlogActive(id: string, isActive: boolean) {
  await requireAdmin();
  await dbConnect();
  const existing = await Blog.findByIdAndUpdate(id, { isActive }, { new: true });
  refreshBlogPages(existing?.slug);
}

export async function createBlog(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const slug = resolveSlug(fields.slug, fields.title);
  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(imageFile, "blogs", "blog");
  if (!url) throw new Error("Image is required");

  await dbConnect();
  await assertUniqueBlogSlug(slug);
  await Blog.create({
    ...fields,
    slug,
    image: url,
    fileId,
    isActive: fields.isActive,
  });
  refreshBlogPages(slug);
}

export async function updateBlog(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const slug = resolveSlug(fields.slug, fields.title);

  await dbConnect();
  const existing = await Blog.findById(id);
  if (!existing) throw new Error("Blog not found");

  await assertUniqueBlogSlug(slug, id);

  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadImage(
    imageFile,
    "blogs",
    "blog",
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
  refreshBlogPages(slug);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

export async function deleteBlog(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await Blog.findById(id);
  if (!existing) throw new Error("Blog not found");

  const slug = existing.slug as string | undefined;
  await deleteImage(existing.fileId);
  await Blog.findByIdAndDelete(id);
  refreshBlogPages(slug);
}
