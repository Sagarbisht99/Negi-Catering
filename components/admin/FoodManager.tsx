"use client";

import { createFood, deleteFood, listFoods, toggleFoodActive, updateFood, type FoodRecord } from "@/app/actions/food";
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
  adminBadgeMuted,
  adminBtn,
  adminField,
  adminGhost,
  adminPanel,
  adminTableHead,
  adminTableRow,
} from "@/components/admin/adminStyles";
import { usePagination } from "@/components/admin/usePagination";
import { useToast } from "@/components/Toast";
import { adminFoodCategories } from "@/data/food";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useMemo, useState } from "react";

export default function FoodManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const foods = useQuery({ queryKey: ["foods"], queryFn: listFoods });
  const [editing, setEditing] = useState<FoodRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<FoodRecord | null>(null);
  const [viewing, setViewing] = useState<FoodRecord | null>(null);

  const rows = useMemo(() => {
    return (foods.data ?? []).filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [foods.data, category, search]);

  const pagination = usePagination(rows);

  const save = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editing) await updateFood(editing.id, formData);
      else await createFood(formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["foods"] });
      await queryClient.invalidateQueries({ queryKey: ["published-foods"] });
      setOpen(false);
      setEditing(null);
      setImageFile(null);
      setError("");
      toast.success(editing ? "Dish updated" : "Dish added");
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const remove = useMutation({
    mutationFn: deleteFood,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["foods"] });
      await queryClient.invalidateQueries({ queryKey: ["published-foods"] });
      setDeleteTarget(null);
      toast.success("Dish deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleFoodActive(id, isActive),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries({ queryKey: ["foods"] });
      await queryClient.invalidateQueries({ queryKey: ["published-foods"] });
      toast.success(vars.isActive ? "Dish set to Active" : "Dish set to Inactive");
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
    console.log("[food submit]", {
      fromState: imageFile ? { name: imageFile.name, size: imageFile.size } : null,
      fromForm: uploaded instanceof File ? { name: uploaded.name, size: uploaded.size } : uploaded,
    });

    if (!editing && !hasFile) {
      setError("Image is required");
      return;
    }

    save.mutate(formData);
  };

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} grid gap-4 p-4 sm:grid-cols-2`}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Category</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              pagination.resetPage();
            }}
            className={adminField}
          >
            <option value="All">All</option>
            {adminFoodCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Search</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pagination.resetPage();
            }}
            placeholder="Search keyword"
            className={adminField}
          />
        </label>
      </div>

      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <h1 className="text-base font-semibold text-white">All dishes</h1>
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
            Add food
          </button>
        </div>

        {foods.isPending ? <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p> : null}
        {foods.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(foods.error as Error).message}
          </p>
        ) : null}
        {!foods.isPending && !rows.length ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">No dishes yet. Add the first food item.</p>
        ) : null}

        {rows.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHead}>
                  <tr>
                    <th className="px-5 py-3 font-medium">Dish</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Description</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((item) => (
                    <tr key={item.id} className={adminTableRow}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <span className="font-medium text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-zinc-400">{item.category}</td>
                      <td className="hidden max-w-xs truncate px-5 py-3 text-zinc-500 md:table-cell">
                        {item.description}
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
                          className={item.isActive ? adminBadge : adminBadgeMuted}
                          title={item.isActive ? "Set inactive" : "Set active"}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="View"
                            aria-label={`View ${item.name}`}
                            className={adminIconBtn}
                            onClick={() => setViewing(item)}
                          >
                            <ViewIcon />
                          </button>
                          <button
                            type="button"
                            title="Edit"
                            aria-label={`Edit ${item.name}`}
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
                            aria-label={`Delete ${item.name}`}
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
            className="scrollbar-admin max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
          >
            <h2 className="text-xl font-semibold text-white">
              {editing ? "Edit food" : "Add food"}
            </h2>
            <input
              name="name"
              required
              defaultValue={editing?.name}
              placeholder="Name"
              className={adminField}
            />
            <select
              name="category"
              required
              defaultValue={editing?.category ?? adminFoodCategories[0]}
              className={adminField}
            >
              {adminFoodCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <textarea
              name="description"
              required
              defaultValue={editing?.description}
              placeholder="Description"
              rows={4}
              className={adminField}
            />
            <ImageDropzone
              key={editing?.id ?? "new"}
              label="Dish image (ImageKit)"
              required={!editing}
              existingImage={editing?.image}
              maxBytes={5_000_000}
              onFileSelect={setImageFile}
            />
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={editing ? editing.isActive !== false : true}
                className="rounded border-white/20 bg-[#121212] text-terracotta focus:ring-terracotta"
              />
              Active on website
            </label>
            {error ? <p className="text-sm font-semibold text-terracotta">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className={adminGhost}>
                Cancel
              </button>
              <button type="submit" disabled={save.isPending} className={adminBtn}>
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
              <h2 className="text-xl font-semibold text-white">{viewing.name}</h2>
              <button type="button" onClick={() => setViewing(null)} className={adminGhost}>
                Close
              </button>
            </div>
            <AdminImage
              src={viewing.image}
              alt={viewing.name}
              className="h-48 w-full rounded-xl object-cover ring-1 ring-white/10"
            />
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Category</dt>
                <dd className="mt-1 text-zinc-200">{viewing.category}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Status</dt>
                <dd className="mt-1">
                  <span className={viewing.isActive ? adminBadge : adminBadgeMuted}>
                    {viewing.isActive ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Description</dt>
                <dd className="mt-1 text-zinc-300">{viewing.description}</dd>
              </div>
            </dl>
            <div className="flex justify-end gap-2">
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
        message={
          deleteTarget
            ? `This will permanently delete “${deleteTarget.name}”. This action cannot be undone.`
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
