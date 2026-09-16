"use client";

import { adminBtn, adminGhost } from "@/components/admin/adminStyles";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="w-full max-w-sm space-y-4 rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 id="confirm-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
          <p id="confirm-message" className="mt-2 text-sm leading-relaxed text-zinc-400">
            {message}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={loading} className={adminGhost}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              danger
                ? "inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                : adminBtn
            }
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
