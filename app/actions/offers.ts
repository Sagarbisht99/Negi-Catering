"use server";

import { revalidatePath } from "next/cache";
import { deleteOfferImage, uploadOfferImage } from "@/lib/imagekit";
import { OfferBanner } from "@/lib/models/OfferBanner";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import { offerFieldsSchema, parseWithZod } from "@/lib/validation";

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

/** Keep at most one banner document; delete older extras. */
async function keepSingleOffer() {
  const rows = await OfferBanner.find().sort({ createdAt: -1 }).lean();
  if (rows.length <= 1) return rows[0] ?? null;

  const [keep, ...extras] = rows;
  for (const row of extras) {
    await deleteOfferImage((row as { fileId?: string }).fileId);
    await OfferBanner.findByIdAndDelete(row._id);
  }
  return keep;
}

export async function getOffer(): Promise<OfferRecord | null> {
  await requireAdmin();
  await dbConnect();
  const row = await keepSingleOffer();
  return row ? serializeDoc<OfferRecord>(row) : null;
}

/** @deprecated Use getOffer — kept for dashboard until callers update */
export async function listOffers(): Promise<OfferRecord[]> {
  const offer = await getOffer();
  return offer ? [offer] : [];
}

export async function getVisibleOffer(): Promise<OfferRecord | null> {
  try {
    if (!process.env.MONGODB_URI) return null;
    await dbConnect();
    const row = await OfferBanner.findOne({ isVisible: true })
      .sort({ createdAt: -1 })
      .lean();
    return row ? serializeDoc<OfferRecord>(row) : null;
  } catch {
    return null;
  }
}

/** Create or replace the single offer banner. */
export async function saveOffer(formData: FormData) {
  await requireAdmin();
  await dbConnect();

  const { isVisible } = parseWithZod(offerFieldsSchema, {
    isVisible: formData.get("isVisible") === "on",
  });
  const imageFile = formData.get("image") as File | null;

  const existing = await keepSingleOffer();
  const existingDoc = existing
    ? await OfferBanner.findById(existing._id)
    : null;

  const { url, fileId } = await uploadOfferImage(
    imageFile,
    existingDoc?.image ?? "",
  );
  if (!url) throw new Error("Image is required");

  if (existingDoc) {
    if (fileId && existingDoc.fileId && fileId !== existingDoc.fileId) {
      await deleteOfferImage(existingDoc.fileId);
    }
    existingDoc.set({
      image: url,
      fileId: fileId ?? existingDoc.fileId,
      isVisible,
    });
    await existingDoc.save();
  } else {
    await OfferBanner.create({ image: url, fileId, isVisible });
  }

  refreshOffers();
}

export async function setOfferVisible(isVisible: boolean) {
  await requireAdmin();
  await dbConnect();

  const existing = await keepSingleOffer();
  if (!existing) throw new Error("No offer banner yet");

  await OfferBanner.findByIdAndUpdate(existing._id, { isVisible });
  refreshOffers();
}

export async function clearOffer() {
  await requireAdmin();
  await dbConnect();

  const rows = await OfferBanner.find().lean();
  for (const row of rows) {
    await deleteOfferImage((row as { fileId?: string }).fileId);
    await OfferBanner.findByIdAndDelete(row._id);
  }
  refreshOffers();
}
