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
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

const FALLBACK_SERVICES: ServiceRecord[] = [
  {
    id: "fallback-daily-tiffin-service",
    name: "Daily Tiffin Service",
    slug: "daily-tiffin-service",
    image: "/images/feast.jpg",
    description:
      "Fresh, home-style daily meals planned for working professionals, students, and families in Delhi NCR.",
    metaTitle: "Daily Tiffin Service in Delhi NCR",
    metaDescription:
      "Affordable daily tiffin service with hygienic home-style meals, curated menus, and timely delivery in East Delhi and nearby NCR areas.",
    metaKeywords:
      "daily tiffin service, office lunch service Delhi NCR, home style tiffin, tiffin service New Ashok Nagar",
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "fallback-house-party-catering",
    name: "House Party Catering",
    slug: "house-party-catering",
    image: "/images/feast.jpg",
    description:
      "Elegant and comforting menus for intimate family get-togethers, house parties, and festive evenings.",
    metaTitle: "House Party Catering in Delhi NCR",
    metaDescription:
      "Custom house party catering with vegetarian menus, buffet setups, and easy planning for family celebrations and social gatherings.",
    metaKeywords:
      "house party catering, family gathering catering, buffet catering Delhi NCR, party menu Delhi",
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "fallback-corporate-event-catering",
    name: "Corporate Event Catering",
    slug: "corporate-event-catering",
    image: "/images/feast.jpg",
    description:
      "Professional catering for office events, meetings, launches, and employee appreciation gatherings.",
    metaTitle: "Corporate Catering for Events and Offices",
    metaDescription:
      "Reliable corporate event catering with efficient service, curated menus, and polished setups for meetings, launches, and team events.",
    metaKeywords:
      "corporate event catering, office catering Delhi NCR, team lunch catering, business event catering",
    isActive: true,
    sortOrder: 3,
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "fallback-birthday-party-catering",
    name: "Birthday Party Catering",
    slug: "birthday-party-catering",
    image: "/images/feast.jpg",
    description:
      "Celebration-ready menus for birthdays, kids parties, and family milestones across Delhi NCR.",
    metaTitle: "Birthday Party Catering in Delhi NCR",
    metaDescription:
      "Birthday party catering with fun, flavorful menus, attractive presentation, and smooth service for celebrations at home or venue.",
    metaKeywords:
      "birthday party catering, kids birthday catering, party food Delhi, celebration catering NCR",
    isActive: true,
    sortOrder: 4,
    createdAt: "2024-01-04T00:00:00.000Z",
    updatedAt: "2024-01-04T00:00:00.000Z",
  },
  {
    id: "fallback-wedding-catering",
    name: "Wedding Catering",
    slug: "wedding-catering",
    image: "/images/feast.jpg",
    description:
      "Large-scale wedding catering with gracious hospitality, festive flavors, and high-volume execution.",
    metaTitle: "Wedding Catering Service",
    metaDescription:
      "Wedding catering designed for elegant traditional meals, multi-course dining, and guest-focused service on your special day.",
    metaKeywords:
      "wedding catering, wedding food service Delhi, Indian wedding catering, banquet catering",
    isActive: true,
    sortOrder: 5,
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z",
  },
  {
    id: "fallback-pooja-catering",
    name: "Pooja Catering",
    slug: "pooja-catering",
    image: "/images/feast.jpg",
    description:
      "Temple-style prasad, vegetarian meals, and ritual-friendly service for poojas, havans, and spiritual gatherings.",
    metaTitle: "Pooja Catering in Delhi NCR",
    metaDescription:
      "Pooja and festive catering with purity-focused menus, prasad offerings, and thoughtful hospitality for religious occasions.",
    metaKeywords:
      "pooja catering, prasad catering Delhi, havan catering, religious event catering",
    isActive: true,
    sortOrder: 6,
    createdAt: "2024-01-06T00:00:00.000Z",
    updatedAt: "2024-01-06T00:00:00.000Z",
  },
  {
    id: "fallback-festival-catering",
    name: "Festival Catering",
    slug: "festival-catering",
    image: "/images/feast.jpg",
    description:
      "Seasonal festival menus and large-batch service for Diwali, Holi, Navratri, and community celebrations.",
    metaTitle: "Festival Catering Service",
    metaDescription:
      "Festive catering with family favorites, bulk menu planning, and warm hospitality for celebrations across Delhi NCR.",
    metaKeywords:
      "festival catering, seasonal event catering, community feast Delhi, festive menu planner",
    isActive: true,
    sortOrder: 7,
    createdAt: "2024-01-07T00:00:00.000Z",
    updatedAt: "2024-01-07T00:00:00.000Z",
  },
];

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
    sortOrder: typeof row.sortOrder === "number" ? row.sortOrder : 100,
  };
}

const serviceListSort = { sortOrder: 1 as const, createdAt: -1 as const };

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
    if (!process.env.MONGODB_URI) return FALLBACK_SERVICES;
    await dbConnect();
    let query = Service.find({ isActive: { $ne: false } }).sort(serviceListSort);
    if (limit && limit > 0) query = query.limit(limit);
    const rows = await query.lean();
    const items = rows.map((row) => normalizeService(serializeDoc<ServiceRecord>(row)));
    return items.length ? items : FALLBACK_SERVICES;
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getPublishedServiceBySlug(
  slug: string,
): Promise<ServiceRecord | null> {
  try {
    if (!process.env.MONGODB_URI || !slug) {
      return FALLBACK_SERVICES.find((service) => service.slug === slug) ?? null;
    }
    await dbConnect();
    const bySlug = await Service.findOne({ slug, isActive: { $ne: false } }).lean();
    if (bySlug) return normalizeService(serializeDoc<ServiceRecord>(bySlug));

    // Legacy docs may not have slug stored yet — match from name.
    const rows = await Service.find({ isActive: { $ne: false } }).lean();
    for (const row of rows) {
      const item = normalizeService(serializeDoc<ServiceRecord>(row));
      if (item.slug === slug) return item;
    }
    return FALLBACK_SERVICES.find((service) => service.slug === slug) ?? null;
  } catch {
    return FALLBACK_SERVICES.find((service) => service.slug === slug) ?? null;
  }
}

export async function listServices(): Promise<ServiceRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Service.find().sort(serviceListSort).lean();
  return rows.map((row) => normalizeService(serializeDoc<ServiceRecord>(row)));
}

/** Move a service up/down — website list updates immediately after revalidate. */
export async function moveService(id: string, direction: "up" | "down") {
  await requireAdmin();
  await dbConnect();

  const rows = await Service.find().sort(serviceListSort).lean();
  const index = rows.findIndex((row) => String(row._id) === id);
  if (index < 0) throw new Error("Service not found");

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const ordered = [...rows];
  [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];

  await Promise.all(
    ordered.map((row, i) => Service.findByIdAndUpdate(row._id, { sortOrder: i })),
  );

  refreshServicePages();
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
  const last = await Service.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
  const nextOrder =
    typeof last?.sortOrder === "number" ? last.sortOrder + 1 : (await Service.countDocuments());
  await Service.create({
    ...fields,
    slug,
    image: url,
    fileId,
    isActive: fields.isActive,
    sortOrder: nextOrder,
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
