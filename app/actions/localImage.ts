"use server";

import { readFile } from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { requireAdmin } from "@/lib/session";

const MAX_BYTES = 5_000_000;
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp"]);

function mimeForExt(ext: string) {
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return `image/${ext.slice(1)}`;
}

function resolveDroppedPath(uriOrPath: string) {
  const raw = uriOrPath.trim().split("\n")[0]?.trim() ?? "";
  if (!raw || raw.startsWith("#")) {
    throw new Error("Could not read that file");
  }

  const filePath = raw.startsWith("file:") ? fileURLToPath(raw) : raw;
  if (!path.isAbsolute(filePath)) {
    throw new Error("Could not read that file");
  }

  const resolved = path.resolve(filePath);
  const home = os.homedir();
  const project = process.cwd();
  const allowedRoots = [home, project];
  const insideRoot = allowedRoots.some(
    (root) => resolved === root || resolved.startsWith(root + path.sep),
  );
  if (!insideRoot) {
    throw new Error("Could not read that file");
  }

  const ext = path.extname(resolved).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Please upload an image file (PNG, JPG, WEBP, etc.)");
  }

  return { resolved, ext };
}

/** Linux file managers often drop a file:// path instead of the file bytes. */
export async function importLocalImage(uriOrPath: string) {
  await requireAdmin();
  const { resolved, ext } = resolveDroppedPath(uriOrPath);
  const buf = await readFile(resolved);

  if (buf.byteLength > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }

  return {
    name: path.basename(resolved),
    type: mimeForExt(ext),
    base64: buf.toString("base64"),
  };
}
