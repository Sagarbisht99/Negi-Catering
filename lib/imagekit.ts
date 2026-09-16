import ImageKit, { toFile } from "@imagekit/nodejs";

const DEFAULT_MAX_BYTES = 5_000_000;

const FOLDERS = {
  food: "/negi-catering/food",
  services: "/negi-catering/services",
  offers: "/negi-catering/offers",
} as const;

export type ImageKitFolder = keyof typeof FOLDERS;

let client: ImageKit | null = null;

export function isImageKitConfigured() {
  return Boolean(
    process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT,
  );
}

function getImageKit() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("ImageKit credentials are not configured in env.");
  }

  if (!client) {
    client = new ImageKit({ privateKey });
  }

  return client;
}

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  // OS drag-drop often sends empty MIME — accept by extension
  return /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif)$/i.test(file.name);
}

function validateImageFile(file: File, maxBytes: number) {
  if (file.size > maxBytes) {
    throw new Error(`Image must be ${Math.round(maxBytes / 1_000_000)}MB or smaller`);
  }
  if (!isImageFile(file)) {
    throw new Error("Please upload an image file");
  }
}

export async function uploadImage(
  file: File | null,
  folder: ImageKitFolder,
  prefix: string,
  fallback = "",
  maxBytes = DEFAULT_MAX_BYTES,
) {
  console.log("[uploadImage]", file ? { name: file.name, size: file.size, type: file.type || "(empty)" } : null);

  if (!file || file.size === 0) {
    return { url: fallback, fileId: undefined as string | undefined };
  }

  validateImageFile(file, maxBytes);

  if (!isImageKitConfigured()) {
    throw new Error("ImageKit credentials are not configured in env.");
  }

  const fromMime = file.type.split("/")[1]?.replace("jpeg", "jpg");
  const fromName = file.name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  const extension = (fromMime || fromName || "jpg").replace("jpeg", "jpg");
  const fileName = `${prefix}-${Date.now()}.${extension}`;
  const mime = file.type || `image/${extension === "jpg" ? "jpeg" : extension}`;

  try {
    const uploadFile = await toFile(await file.arrayBuffer(), fileName, { type: mime });
    const response = await getImageKit().files.upload({
      file: uploadFile,
      fileName,
      folder: FOLDERS[folder],
    });

    if (!response.url) {
      throw new Error("ImageKit upload failed");
    }

    console.log("[uploadImage] ok", response.url);
    return { url: response.url, fileId: response.fileId };
  } catch (err) {
    console.error("[ImageKit]", err);
    const message = err instanceof Error ? err.message : "ImageKit upload failed";
    if (message.toLowerCase().includes("connection")) {
      throw new Error("Could not reach ImageKit. Check internet and try again.");
    }
    throw new Error(message);
  }
}

export async function deleteImage(fileId?: string | null) {
  if (!fileId || !isImageKitConfigured()) return;

  try {
    await getImageKit().files.delete(fileId);
  } catch {
    // Ignore ImageKit delete failures so DB cleanup still proceeds.
  }
}

// Backwards-compatible helpers for offers
export const uploadOfferImage = (file: File | null, fallback = "") =>
  uploadImage(file, "offers", "offer", fallback);

export const deleteOfferImage = deleteImage;
