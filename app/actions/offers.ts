"use server";

import { revalidatePath } from "next/cache";
import { deleteOfferImage, uploadOfferImage } from "@/lib/imagekit";
import { OfferBanner } from "@/lib/models/OfferBanner";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";

export type OfferRecord = {
  id: string;
  image: string;
  fileId?: string;
  isVisible: boolean;
};

function refreshOffers() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/offers");
  revalidatePath("/admin/dashboard");
}

export async function listOffers(): Promise<OfferRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await OfferBanner.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => serializeDoc<OfferRecord>(row));
}

export async function getVisibleOffer(): Promise<OfferRecord | null> {
  try {
    if (!process.env.MONGODB_URI) return null;
    await dbConnect();
    const row = await OfferBanner.findOne({ isVisible: true }).lean();
    return row ? serializeDoc<OfferRecord>(row) : null;
  } catch {
    return null;
  }
}

export async function createOffer(formData: FormData) {
  await requireAdmin();
  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadOfferImage(imageFile);
  if (!url) throw new Error("Image is required");

  const isVisible = formData.get("isVisible") === "on";

  await dbConnect();
  if (isVisible) {
    await OfferBanner.updateMany({}, { isVisible: false });
  }

  await OfferBanner.create({ image: url, fileId, isVisible });
  refreshOffers();
}

export async function updateOffer(id: string, formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const existing = await OfferBanner.findById(id);
  if (!existing) throw new Error("Offer not found");

  const imageFile = formData.get("image") as File | null;
  const { url, fileId } = await uploadOfferImage(imageFile, existing.image);
  const isVisible = formData.get("isVisible") === "on";

  if (fileId && existing.fileId && fileId !== existing.fileId) {
    await deleteOfferImage(existing.fileId);
  }

  if (isVisible) {
    await OfferBanner.updateMany({ _id: { $ne: id } }, { isVisible: false });
  }

  existing.set({ image: url, fileId: fileId ?? existing.fileId, isVisible });
  await existing.save();
  refreshOffers();
}

export async function toggleOffer(id: string, isVisible: boolean) {
  await requireAdmin();
  await dbConnect();

  if (isVisible) {
    await OfferBanner.updateMany({}, { isVisible: false });
  }

  await OfferBanner.findByIdAndUpdate(id, { isVisible });
  refreshOffers();
}

export async function deleteOffer(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await OfferBanner.findById(id);
  if (!existing) throw new Error("Offer not found");

  await deleteOfferImage(existing.fileId);
  await OfferBanner.findByIdAndDelete(id);
  refreshOffers();
}
