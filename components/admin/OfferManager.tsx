"use client";

import {
  clearOffer,
  getOffer,
  saveOffer,
  setOfferVisible,
} from "@/app/actions/offers";
import AdminImage from "@/components/admin/AdminImage";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageDropzone from "@/components/admin/ImageDropzone";
import { DeleteIcon, adminIconBtn } from "@/components/admin/AdminActionIcons";
import {
  adminBadge,
  adminBtn,
  adminGhost,
  adminPanel,
} from "@/components/admin/adminStyles";
import { useToast } from "@/components/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

export default function OfferManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const offerQuery = useQuery({ queryKey: ["offers"], queryFn: getOffer });
  const offer = offerQuery.data ?? null;

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["offers"] }),
      queryClient.invalidateQueries({ queryKey: ["visible-offer"] }),
    ]);

  const save = useMutation({
    mutationFn: saveOffer,
    onSuccess: async () => {
      await invalidate();
      setEditing(false);
      setImageFile(null);
      setError("");
      toast.success(offer ? "Offer banner updated" : "Offer banner saved");
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const toggle = useMutation({
    mutationFn: setOfferVisible,
    onSuccess: async (_data, isVisible) => {
      await invalidate();
      toast.success(isVisible ? "Banner visible on site" : "Banner hidden");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: clearOffer,
    onSuccess: async () => {
      await invalidate();
      setConfirmClear(false);
      setEditing(false);
      toast.success("Offer banner removed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.set("image", imageFile);

    const uploaded = formData.get("image");
    const hasFile = uploaded instanceof File && uploaded.size > 0;

    if (!offer && !hasFile) {
      setError("Image is required");
      return;
    }

    save.mutate(formData);
  };

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="text-base font-semibold text-white">Offer banner</h1>
            <p className="mt-1 text-sm text-zinc-500">
              One popup image for the website. Replace anytime via ImageKit.
            </p>
          </div>
          {offer ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={adminBtn}
                onClick={() => {
                  setImageFile(null);
                  setError("");
                  setEditing(true);
                }}
              >
                Replace image
              </button>
              <button
                type="button"
                title="Remove banner"
                aria-label="Remove banner"
                className={`${adminIconBtn} hover:border-red-500/30 hover:text-red-400`}
                onClick={() => setConfirmClear(true)}
              >
                <DeleteIcon />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={adminBtn}
              onClick={() => {
                setImageFile(null);
                setError("");
                setEditing(true);
              }}
            >
              Upload banner
            </button>
          )}
        </div>

        {offerQuery.isPending ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p>
        ) : null}
        {offerQuery.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(offerQuery.error as Error).message}
          </p>
        ) : null}

        {!offerQuery.isPending && !offer ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">
            No banner yet. Upload one image to show as the site popup.
          </p>
        ) : null}

        {offer ? (
          <div className="space-y-4 border-t border-white/5 px-5 py-5">
            <AdminImage
              src={offer.image}
              alt="Offer banner"
              className="mx-auto max-h-72 w-full max-w-md rounded-xl object-contain ring-1 ring-white/10"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={offer.isVisible ? adminBadge : "text-sm text-zinc-500"}>
                {offer.isVisible ? "Visible on site" : "Hidden"}
              </span>
              <button
                type="button"
                disabled={toggle.isPending}
                className={adminGhost}
                onClick={() => toggle.mutate(!offer.isVisible)}
              >
                {offer.isVisible ? "Hide from website" : "Show on website"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={onSubmit}
            className="scrollbar-admin max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
          >
            <h2 className="text-xl font-semibold text-white">
              {offer ? "Replace offer banner" : "Upload offer banner"}
            </h2>

            <ImageDropzone
              key={offer?.id ?? "new"}
              label="Offer banner image"
              required={!offer}
              existingImage={offer?.image}
              maxBytes={5_000_000}
              onFileSelect={setImageFile}
            />

            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked={offer?.isVisible ?? true}
                className="rounded border-white/20 bg-[#121212] text-terracotta focus:ring-terracotta"
              />
              Show this banner on the website
            </label>

            {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={adminGhost}
              >
                Cancel
              </button>
              <button type="submit" disabled={save.isPending} className={adminBtn}>
                {save.isPending ? "Uploading..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmClear}
        title="Remove offer banner?"
        message="This permanently deletes the popup banner. You can upload a new one later."
        confirmLabel="Remove"
        danger
        loading={remove.isPending}
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => remove.mutate()}
      />
    </section>
  );
}
