"use client";

import AdminImage from "@/components/admin/AdminImage";
import { useVisibleOffer } from "@/lib/publicQueries";
import { useEffect, useState } from "react";

export default function OfferPopup() {
  const offer = useVisibleOffer();
  const image = offer.data?.image ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!image) return;
    const key = `negi-offer:${image.slice(0, 80)}`;
    if (sessionStorage.getItem(key) === "1") return;
    setOpen(true);
  }, [image]);

  if (!open || !image) return null;

  const dismiss = () => {
    sessionStorage.setItem(`negi-offer:${image.slice(0, 80)}`, "1");
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/70 p-4"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close offer"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card text-xl font-bold text-ink"
        >
          ×
        </button>
        <AdminImage src={image} alt="Special offer" className="max-h-[80vh] w-full object-contain" />
      </div>
    </div>
  );
}
