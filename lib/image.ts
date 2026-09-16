const MAX_BYTES = 1_500_000;

export async function fileToDataUrl(file: File | null, fallback = "") {
  if (!file || file.size === 0) return fallback;
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 1.5MB or smaller");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}
