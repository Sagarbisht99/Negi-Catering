"use client";

import AdminImage from "@/components/admin/AdminImage";
import { useVisibleOffer } from "@/lib/publicQueries";
import { useEffect, useState } from "react";

const OPEN_DELAY_MS = 10_000;

export default function OfferPopup() {
  const offer = useVisibleOffer();
  const image = offer.data?.image ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!image) return;

    const id = window.setTimeout(() => {
      setOpen(true);
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(id);
  }, [image]);

  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/70 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close offer"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card text-xl font-bold text-ink"
        >
          ×
        </button>
        <AdminImage src={image} alt="Special offer" className="max-h-[80vh] w-full object-contain" />
      </div>
    </div>
  );
}
