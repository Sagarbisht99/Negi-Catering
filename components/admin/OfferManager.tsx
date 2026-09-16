"use client";

import {
  createOffer,
  deleteOffer,
  listOffers,
  toggleOffer,
  updateOffer,
  type OfferRecord,
} from "@/app/actions/offers";
import AdminImage from "@/components/admin/AdminImage";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageDropzone from "@/components/admin/ImageDropzone";
import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
  adminIconBtn,
} from "@/components/admin/AdminActionIcons";
import {
  adminBadge,
  adminBtn,
  adminGhost,
  adminPanel,
  adminTableHead,
  adminTableRow,
} from "@/components/admin/adminStyles";
import { usePagination } from "@/components/admin/usePagination";
import { useToast } from "@/components/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useMemo, useState } from "react";

export default function OfferManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const offers = useQuery({ queryKey: ["offers"], queryFn: listOffers });
  const [editing, setEditing] = useState<OfferRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OfferRecord | null>(null);
  const [viewing, setViewing] = useState<OfferRecord | null>(null);

  const rows = useMemo(() => offers.data ?? [], [offers.data]);
  const pagination = usePagination(rows);

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["offers"] }),
      queryClient.invalidateQueries({ queryKey: ["visible-offer"] }),
    ]);

  const save = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editing) await updateOffer(editing.id, formData);
      else await createOffer(formData);
    },
    onSuccess: async () => {
      await invalidate();
      setOpen(false);
      setEditing(null);
      setImageFile(null);
      setError("");
      toast.success(editing ? "Offer updated" : "Offer added");
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const toggle = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      toggleOffer(id, isVisible),
    onSuccess: async (_data, vars) => {
      await invalidate();
      toast.success(vars.isVisible ? "Offer is now visible" : "Offer is now hidden");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: deleteOffer,
    onSuccess: async () => {
      await invalidate();
      setDeleteTarget(null);
      toast.success("Offer deleted");
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

    if (!editing && !hasFile) {
      setError("Image is required");
      return;
    }

    save.mutate(formData);
  };

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="text-base font-semibold text-white">Offer banners</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Upload via ImageKit. Drag & drop images to add or replace.
            </p>
          </div>
          <button
            type="button"
            className={adminBtn}
            onClick={() => {
              setEditing(null);
              setImageFile(null);
              setOpen(true);
              setError("");
            }}
          >
            Add offer
          </button>
        </div>

        {offers.isPending ? <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p> : null}
        {offers.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(offers.error as Error).message}
          </p>
        ) : null}
        {!offers.isPending && !rows.length ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">
            No offer banners yet. Upload an image and toggle it on.
          </p>
        ) : null}

        {rows.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHead}>
                  <tr>
                    <th className="px-5 py-3 font-medium">Banner</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((item) => (
                    <tr key={item.id} className={adminTableRow}>
                      <td className="px-5 py-3">
                        <AdminImage
                          src={item.image}
                          alt="Offer banner"
                          className="h-16 w-28 rounded-lg object-cover ring-1 ring-white/10"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <span className={item.isVisible ? adminBadge : "text-zinc-500"}>
                          {item.isVisible ? "Visible on site" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View"
                            aria-label="View offer"
                            className={adminIconBtn}
                            onClick={() => setViewing(item)}
                          >
                            <ViewIcon />
                          </button>
                          <button
                            type="button"
                            title="Edit"
                            aria-label="Edit offer"
                            className={adminIconBtn}
                            onClick={() => {
                              setEditing(item);
                              setImageFile(null);
                              setOpen(true);
                              setError("");
                            }}
                          >
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            aria-label="Delete offer"
                            className={`${adminIconBtn} hover:border-red-500/30 hover:text-red-400`}
                            onClick={() => setDeleteTarget(item)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              from={pagination.from}
              to={pagination.to}
              hasPrev={pagination.hasPrev}
              hasNext={pagination.hasNext}
              onPageChange={pagination.setPage}
            />
          </>
        ) : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <form
            onSubmit={onSubmit}
            className="scrollbar-admin max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
          >
            <h2 className="text-xl font-semibold text-white">
              {editing ? "Edit offer" : "Add offer"}
            </h2>

            <ImageDropzone
              key={editing?.id ?? "new"}
              label="Offer banner image"
              required={!editing}
              existingImage={editing?.image}
              maxBytes={5_000_000}
              onFileSelect={setImageFile}
            />

            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked={editing?.isVisible}
                className="rounded border-white/20 bg-[#121212] text-terracotta focus:ring-terracotta"
              />
              Show this banner on the website
            </label>

            {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className={adminGhost}>
                Cancel
              </button>
              <button type="submit" disabled={save.isPending} className={adminBtn}>
                {save.isPending ? "Uploading..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {viewing ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="scrollbar-admin max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Offer banner</h2>
              <button type="button" onClick={() => setViewing(null)} className={adminGhost}>
                Close
              </button>
            </div>
            <AdminImage
              src={viewing.image}
              alt="Offer banner"
              className="h-48 w-full rounded-xl object-cover ring-1 ring-white/10"
            />
            <p className="text-sm text-zinc-400">
              {viewing.isVisible ? "Visible on website" : "Hidden from website"}
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                disabled={toggle.isPending}
                className={adminGhost}
                onClick={() => {
                  toggle.mutate({ id: viewing.id, isVisible: !viewing.isVisible });
                  setViewing({ ...viewing, isVisible: !viewing.isVisible });
                }}
              >
                {viewing.isVisible ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                title="Edit"
                className={adminIconBtn}
                onClick={() => {
                  setEditing(viewing);
                  setImageFile(null);
                  setViewing(null);
                  setOpen(true);
                  setError("");
                }}
              >
                <EditIcon />
              </button>
              <button
                type="button"
                title="Delete"
                className={`${adminIconBtn} hover:border-red-500/30 hover:text-red-400`}
                onClick={() => setDeleteTarget(viewing)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Are you sure to delete?"
        message="This will permanently delete this offer banner. This action cannot be undone."
        confirmLabel="Delete"
        danger
        loading={remove.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) remove.mutate(deleteTarget.id);
        }}
      />
    </section>
  );
}
