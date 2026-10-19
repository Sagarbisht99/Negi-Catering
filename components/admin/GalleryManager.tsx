"use client";

import {
  createGalleryImage,
  deleteGalleryImage,
  listGallery,
  moveGalleryImage,
  toggleGalleryActive,
  updateGalleryImage,
  type GalleryImageRecord,
} from "@/app/actions/gallery";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
  adminIconBtn,
} from "@/components/admin/AdminActionIcons";
import AdminImage from "@/components/admin/AdminImage";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageDropzone from "@/components/admin/ImageDropzone";
import {
  adminBadge,
  adminBadgeMuted,
  adminBtn,
  adminField,
  adminGhost,
  adminPanel,
  adminTableHead,
  adminTableRow,
  adminTableScroll,
} from "@/components/admin/adminStyles";
import { usePagination } from "@/components/admin/usePagination";
import { useToast } from "@/components/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useMemo, useState } from "react";

export default function GalleryManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const gallery = useQuery({ queryKey: ["gallery"], queryFn: listGallery });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImageRecord | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState<GalleryImageRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImageRecord | null>(
    null,
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (gallery.data ?? []).filter(
      (item) => !q || item.caption.toLowerCase().includes(q),
    );
  }, [gallery.data, search]);

  const pagination = usePagination(rows);
  const fullList = gallery.data ?? [];
  const searching = Boolean(search.trim());

  const invalidateLists = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["gallery"] }),
      queryClient.invalidateQueries({ queryKey: ["published-gallery"] }),
    ]);

  const save = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editing) await updateGalleryImage(editing.id, formData);
      else await createGalleryImage(formData);
    },
    onSuccess: async () => {
      await invalidateLists();
      setOpen(false);
      setEditing(null);
      setImageFile(null);
      setError("");
      toast.success(editing ? "Image updated" : "Image added to gallery");
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const remove = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: async () => {
      await invalidateLists();
      setDeleteTarget(null);
      setViewing(null);
      toast.success("Image deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleGalleryActive(id, isActive),
    onSuccess: async (_data, vars) => {
      await invalidateLists();
      toast.success(vars.isActive ? "Image shown on site" : "Image hidden");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reorder = useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: "up" | "down" }) =>
      moveGalleryImage(id, direction),
    onMutate: async ({ id, direction }) => {
      await queryClient.cancelQueries({ queryKey: ["gallery"] });
      const previous = queryClient.getQueryData<GalleryImageRecord[]>([
        "gallery",
      ]);
      if (previous) {
        const next = [...previous];
        const index = next.findIndex((item) => item.id === id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        if (index >= 0 && swapWith >= 0 && swapWith < next.length) {
          [next[index], next[swapWith]] = [next[swapWith], next[index]];
          queryClient.setQueryData(["gallery"], next);
        }
      }
      return { previous };
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["gallery"], ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => toast.success("Order updated — live on site"),
    onSettled: async () => {
      await invalidateLists();
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    if (imageFile) formData.set("image", imageFile);

    const uploaded = formData.get("image");
    const hasFile = uploaded instanceof File && uploaded.size > 0;

    if (!editing && !hasFile) {
      setError("Please choose an image to upload");
      return;
    }

    save.mutate(formData);
  };

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} p-4`}>
        <label className="block max-w-md">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Search
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pagination.resetPage();
            }}
            placeholder="Search by caption"
            className={adminField}
          />
        </label>
      </div>

      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="text-base font-semibold text-white">
              Gallery images
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Only image files can be uploaded. Use ↑ ↓ to change website order.
            </p>
          </div>
          <button
            type="button"
            className={adminBtn}
            onClick={() => {
              setEditing(null);
              setImageFile(null);
              setError("");
              setOpen(true);
            }}
          >
            Add image
          </button>
        </div>

        {gallery.isPending ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p>
        ) : null}
        {gallery.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(gallery.error as Error).message}
          </p>
        ) : null}
        {!gallery.isPending && !rows.length ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">
            {searching
              ? "No images match your search."
              : "No gallery images yet. Add the first image."}
          </p>
        ) : null}

        {rows.length ? (
          <>
            <div className={adminTableScroll}>
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHead}>
                  <tr>
                    <th className="px-5 py-3 font-medium">Image</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((item) => {
                    const fullIndex = fullList.findIndex(
                      (row) => row.id === item.id,
                    );
                    const canUp = !searching && fullIndex > 0;
                    const canDown =
                      !searching &&
                      fullIndex >= 0 &&
                      fullIndex < fullList.length - 1;

                    return (
                      <tr key={item.id} className={adminTableRow}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <AdminImage
                              src={item.image}
                              alt={item.caption || "Gallery image"}
                              className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                            />
                            <span className="min-w-0 truncate text-zinc-300">
                              {item.caption || (
                                <span className="text-zinc-600">
                                  No caption
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            disabled={toggleActive.isPending}
                            onClick={() =>
                              toggleActive.mutate({
                                id: item.id,
                                isActive: !item.isActive,
                              })
                            }
                            className={
                              item.isActive ? adminBadge : adminBadgeMuted
                            }
                            title={
                              item.isActive
                                ? "Hide from website"
                                : "Show on website"
                            }
                          >
                            {item.isActive ? "Visible" : "Hidden"}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="Move up"
                              aria-label="Move image up"
                              disabled={!canUp || reorder.isPending}
                              className={adminIconBtn}
                              onClick={() =>
                                reorder.mutate({ id: item.id, direction: "up" })
                              }
                            >
                              <ChevronUpIcon />
                            </button>
                            <button
                              type="button"
                              title="Move down"
                              aria-label="Move image down"
                              disabled={!canDown || reorder.isPending}
                              className={adminIconBtn}
                              onClick={() =>
                                reorder.mutate({
                                  id: item.id,
                                  direction: "down",
                                })
                              }
                            >
                              <ChevronDownIcon />
                            </button>
                            <button
                              type="button"
                              title="View"
                              aria-label="View image"
                              className={adminIconBtn}
                              onClick={() => setViewing(item)}
                            >
                              <ViewIcon />
                            </button>
                            <button
                              type="button"
                              title="Edit"
                              aria-label="Edit image"
                              className={adminIconBtn}
                              onClick={() => {
                                setEditing(item);
                                setImageFile(null);
                                setError("");
                                setOpen(true);
                              }}
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              aria-label="Delete image"
                              className={`${adminIconBtn} hover:border-red-500/30 hover:text-red-400`}
                              onClick={() => setDeleteTarget(item)}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
            className="scrollbar-admin max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
          >
            <h2 className="text-xl font-semibold text-white">
              {editing ? "Edit gallery image" : "Add gallery image"}
            </h2>
            <ImageDropzone
              key={editing?.id ?? "new"}
              label="Gallery image (ImageKit · images only)"
              required={!editing}
              existingImage={editing?.image}
              maxBytes={5_000_000}
              onFileSelect={setImageFile}
            />
            <input
              name="caption"
              defaultValue={editing?.caption ?? ""}
              placeholder="Caption (optional)"
              className={adminField}
            />
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={editing ? editing.isActive !== false : true}
                className="rounded border-white/20 bg-[#121212] text-terracotta focus:ring-terracotta"
              />
              Visible on website
            </label>
            {error ? (
              <p className="text-sm font-semibold text-terracotta">{error}</p>
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={adminGhost}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={save.isPending}
                className={adminBtn}
              >
                {save.isPending ? "Saving..." : "Save"}
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
              <h2 className="text-xl font-semibold text-white">
                {viewing.caption || "Gallery image"}
              </h2>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className={adminGhost}
              >
                Close
              </button>
            </div>
            <AdminImage
              src={viewing.image}
              alt={viewing.caption || "Gallery image"}
              className="max-h-80 w-full rounded-xl object-contain ring-1 ring-white/10"
            />
            <p>
              <span className={viewing.isActive ? adminBadge : adminBadgeMuted}>
                {viewing.isActive ? "Visible" : "Hidden"}
              </span>
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                title="Edit"
                className={adminIconBtn}
                onClick={() => {
                  setEditing(viewing);
                  setImageFile(null);
                  setViewing(null);
                  setError("");
                  setOpen(true);
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
        message={
          deleteTarget
            ? `This will permanently delete this image${
                deleteTarget.caption ? ` (“${deleteTarget.caption}”)` : ""
              } from the gallery.`
            : ""
        }
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
