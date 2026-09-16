"use client";

import { importLocalImage } from "@/app/actions/localImage";
import { ChangeEvent, DragEvent, useEffect, useId, useRef, useState } from "react";

const DEFAULT_MAX_BYTES = 5_000_000;

type ImageDropzoneProps = {
  name?: string;
  required?: boolean;
  existingImage?: string;
  maxBytes?: number;
  label?: string;
  onFileSelect: (file: File | null) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File) {
  if (!file.type || file.type === "application/octet-stream") {
    return /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif)$/i.test(file.name) || !file.name.includes(".");
  }
  return file.type.startsWith("image/") || /\.(jpe?g|png|gif|webp|bmp|svg|avif|heic|heif)$/i.test(file.name);
}

function takeDroppedFile(dt: DataTransfer | null): File | null {
  if (!dt) return null;
  if (dt.files?.length) return dt.files[0];
  for (const item of Array.from(dt.items ?? [])) {
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) return file;
    }
  }
  return null;
}

function droppedPath(dt: DataTransfer | null): string {
  if (!dt) return "";
  const raw = dt.getData("text/uri-list") || dt.getData("text/plain") || "";
  return (
    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith("#")) ?? ""
  );
}

function fileFromBase64(name: string, type: string, base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type });
}

export default function ImageDropzone({
  name = "image",
  required = false,
  existingImage,
  maxBytes = DEFAULT_MAX_BYTES,
  label = "Image",
  onFileSelect,
}: ImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const onFileSelectRef = useRef(onFileSelect);
  onFileSelectRef.current = onFileSelect;

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const clearSelection = () => {
    setError("");
    setFileName("");
    setFileSize(0);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileSelectRef.current(null);
  };

  const applyFile = (file: File) => {
    if (!isImageFile(file)) {
      setError("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > maxBytes) {
      setError(`Image must be ${formatSize(maxBytes)} or smaller`);
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreview(url);
    setFileName(file.name);
    setFileSize(file.size);
    setError("");
    onFileSelectRef.current(file);

    if (inputRef.current) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        inputRef.current.files = dt.files;
      } catch {
        // Parent state still holds the File
      }
    }
  };

  const handleDrop = async (dt: DataTransfer | null) => {
    const file = takeDroppedFile(dt);
    if (file) {
      applyFile(file);
      return;
    }

    const localPath = droppedPath(dt);
    if (!localPath) {
      setError("Could not read that file. Click the box to browse.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const imported = await importLocalImage(localPath);
      applyFile(fileFromBase64(imported.name, imported.type, imported.base64));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file. Click the box to browse.");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    setDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setDragging(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    void handleDrop(e.dataTransfer);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const displayImage = preview ?? existingImage;
  const hasNewFile = Boolean(preview);
  const maxLabel = formatSize(maxBytes);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-400">
          {label}
          {required && !existingImage ? <span className="text-terracotta"> *</span> : null}
        </span>
        {hasNewFile ? (
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-medium text-zinc-500 transition hover:text-white"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative min-h-[180px] cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition ${
          dragging
            ? "border-terracotta bg-terracotta/10"
            : error
              ? "border-terracotta/50 bg-terracotta/5"
              : "border-white/15 hover:border-white/30 hover:bg-white/[0.02]"
        }`}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          name={name}
          tabIndex={-1}
          onChange={onInputChange}
          onClick={(e) => e.stopPropagation()}
          className="sr-only"
        />

        {dragging || loading ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-terracotta/15">
            <span className="rounded-full bg-[#141414]/95 px-4 py-2 text-sm font-semibold text-terracotta-soft">
              {loading ? "Reading image..." : "Drop image here"}
            </span>
          </div>
        ) : null}

        <div className="pointer-events-none">
          {displayImage ? (
            <div className="space-y-3 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt="Upload preview"
                className="mx-auto max-h-52 w-full rounded-lg object-contain"
              />
              {hasNewFile ? (
                <div className="rounded-lg bg-white/5 px-3 py-2 text-left">
                  <p className="truncate text-sm font-medium text-zinc-200">{fileName}</p>
                  <p className="text-xs text-zinc-500">{formatSize(fileSize)}</p>
                </div>
              ) : (
                <p className="text-center text-sm text-zinc-400">
                  Drag & drop or click to replace
                </p>
              )}
            </div>
          ) : (
            <div className="flex min-h-[180px] flex-col items-center justify-center space-y-2 px-4 py-10 text-center">
              <UploadIcon dragging={dragging} />
              <p className="text-sm font-medium text-zinc-300">Drag & drop your image here</p>
              <p className="text-xs text-zinc-500">or click to browse</p>
              <p className="text-xs text-zinc-600">PNG, JPG, WEBP · max {maxLabel}</p>
            </div>
          )}
        </div>
      </div>

      {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}
    </div>
  );
}

function UploadIcon({ dragging }: { dragging: boolean }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`mx-auto transition ${dragging ? "text-terracotta-soft" : "text-zinc-500"}`}
    >
      <path
        d="M12 16V4m0 0 7 7m-7-7L5 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
