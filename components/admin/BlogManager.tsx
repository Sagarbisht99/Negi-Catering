"use client";

import {
  createBlog,
  deleteBlog,
  listBlogs,
  moveBlog,
  toggleBlogActive,
  updateBlog,
  type BlogRecord,
} from "@/app/actions/blogs";
import AdminImage from "@/components/admin/AdminImage";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageDropzone from "@/components/admin/ImageDropzone";
import SeoFields from "@/components/admin/SeoFields";
import {
  ChevronDownIcon,
  ChevronUpIcon,
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
  adminTableScroll,
} from "@/components/admin/adminStyles";
import { usePagination } from "@/components/admin/usePagination";
import { useToast } from "@/components/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useMemo, useState } from "react";

export default function BlogManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const blogs = useQuery({ queryKey: ["blogs"], queryFn: listBlogs });
  const [editing, setEditing] = useState<BlogRecord | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<BlogRecord | null>(null);
  const [viewing, setViewing] = useState<BlogRecord | null>(null);
  const [titleForSlug, setTitleForSlug] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (blogs.data ?? []).filter(
      (item) =>
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.metaKeywords.toLowerCase().includes(q),
    );
  }, [blogs.data, search]);

  const pagination = usePagination(rows);
  const fullList = blogs.data ?? [];
  const searching = Boolean(search.trim());

  const invalidateLists = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["blogs"] }),
      queryClient.invalidateQueries({ queryKey: ["published-blogs"] }),
    ]);

  const save = useMutation({
    mutationFn: async (formData: FormData) => {
      if (editing) await updateBlog(editing.id, formData);
      else await createBlog(formData);
    },
    onSuccess: async () => {
      await invalidateLists();
      setOpen(false);
      setEditing(null);
      setImageFile(null);
      setError("");
      toast.success(editing ? "Blog updated" : "Blog added");
    },
    onError: (err: Error) => {
      setError(err.message);
      toast.error(err.message);
    },
  });

  const remove = useMutation({
    mutationFn: deleteBlog,
    onSuccess: async () => {
      await invalidateLists();
      setDeleteTarget(null);
      toast.success("Blog deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleBlogActive(id, isActive),
    onSuccess: async (_data, vars) => {
      await invalidateLists();
      toast.success(vars.isActive ? "Blog set to Active" : "Blog set to Inactive");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reorder = useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: "up" | "down" }) =>
      moveBlog(id, direction),
    onMutate: async ({ id, direction }) => {
      await queryClient.cancelQueries({ queryKey: ["blogs"] });
      const previous = queryClient.getQueryData<BlogRecord[]>(["blogs"]);
      if (previous) {
        const next = [...previous];
        const index = next.findIndex((item) => item.id === id);
        const swapWith = direction === "up" ? index - 1 : index + 1;
        if (index >= 0 && swapWith >= 0 && swapWith < next.length) {
          [next[index], next[swapWith]] = [next[swapWith], next[index]];
          queryClient.setQueryData(["blogs"], next);
        }
      }
      return { previous };
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["blogs"], ctx.previous);
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Order updated — live on site");
    },
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
      setError("Cover image is required");
      return;
    }

    save.mutate(formData);
  };

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} p-4`}>
        <label className="block max-w-md">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Search</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pagination.resetPage();
            }}
            placeholder="Search title, slug, or keywords"
            className={adminField}
          />
        </label>
      </div>

      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="text-base font-semibold text-white">All blogs</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Use ↑ ↓ to change website order instantly.
              {searching ? " Clear search to reorder." : ""}
            </p>
          </div>
          <button
            type="button"
            className={adminBtn}
            onClick={() => {
              setEditing(null);
              setTitleForSlug("");
              setImageFile(null);
              setOpen(true);
              setError("");
            }}
          >
            Add blog
          </button>
        </div>

        {blogs.isPending ? <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p> : null}
        {blogs.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(blogs.error as Error).message}
          </p>
        ) : null}
        {!blogs.isPending && !rows.length ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">No blogs yet. Add the first post.</p>
        ) : null}

        {rows.length ? (
          <>
            <div className={adminTableScroll}>
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHead}>
                  <tr>
                    <th className="px-5 py-3 font-medium">Blog</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Excerpt</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((item) => {
                    const fullIndex = fullList.findIndex((row) => row.id === item.id);
                    const canUp = !searching && fullIndex > 0;
                    const canDown = !searching && fullIndex >= 0 && fullIndex < fullList.length - 1;

                    return (
                    <tr key={item.id} className={adminTableRow}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <AdminImage
                            src={item.image}
                            alt={item.title}
                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <div className="min-w-0">
                            <span className="font-medium text-white">{item.title}</span>
                            <p className="truncate text-xs text-zinc-500">/{item.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden max-w-md truncate px-5 py-3 text-zinc-500 md:table-cell">
                        {item.excerpt}
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
                            title="Move up"
                            aria-label={`Move ${item.title} up`}
                            disabled={!canUp || reorder.isPending}
                            className={adminIconBtn}
                            onClick={() => reorder.mutate({ id: item.id, direction: "up" })}
                          >
                            <ChevronUpIcon />
                          </button>
                          <button
                            type="button"
                            title="Move down"
                            aria-label={`Move ${item.title} down`}
                            disabled={!canDown || reorder.isPending}
                            className={adminIconBtn}
                            onClick={() => reorder.mutate({ id: item.id, direction: "down" })}
                          >
                            <ChevronDownIcon />
                          </button>
                          <button
                            type="button"
                            title="View"
                            aria-label={`View ${item.title}`}
                            className={adminIconBtn}
                            onClick={() => setViewing(item)}
                          >
                            <ViewIcon />
                          </button>
                          <button
                            type="button"
                            title="Edit"
                            aria-label={`Edit ${item.title}`}
                            className={adminIconBtn}
                            onClick={() => {
                              setEditing(item);
                              setTitleForSlug(item.title);
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
                            aria-label={`Delete ${item.title}`}
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
            className="scrollbar-admin max-h-[90vh] w-full max-w-2xl space-y-3 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
          >
            <h2 className="text-xl font-semibold text-white">
              {editing ? "Edit blog" : "Add blog"}
            </h2>
            <input
              name="title"
              required
              value={titleForSlug}
              onChange={(e) => setTitleForSlug(e.target.value)}
              placeholder="Title"
              className={adminField}
            />
            <textarea
              name="excerpt"
              required
              defaultValue={editing?.excerpt}
              placeholder="Short excerpt"
              rows={2}
              className={adminField}
            />
            <textarea
              name="content"
              required
              defaultValue={editing?.content}
              placeholder="Full blog content"
              rows={8}
              className={adminField}
            />
            <ImageDropzone
              key={editing?.id ?? "new"}
              label="Cover image (ImageKit)"
              required={!editing}
              existingImage={editing?.image}
              maxBytes={5_000_000}
              onFileSelect={setImageFile}
            />
            <SeoFields
              formKey={editing?.id ?? "new-blog"}
              sourceTitle={titleForSlug}
              defaults={
                editing
                  ? {
                      slug: editing.slug,
                      metaTitle: editing.metaTitle,
                      metaDescription: editing.metaDescription,
                      metaKeywords: editing.metaKeywords,
                    }
                  : undefined
              }
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
            className="scrollbar-admin max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{viewing.title}</h2>
              <button type="button" onClick={() => setViewing(null)} className={adminGhost}>
                Close
              </button>
            </div>
            <AdminImage
              src={viewing.image}
              alt={viewing.title}
              className="h-48 w-full rounded-xl object-cover ring-1 ring-white/10"
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Status</p>
              <p className="mt-1">
                <span className={viewing.isActive ? adminBadge : adminBadgeMuted}>
                  {viewing.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Excerpt</p>
              <p className="mt-1 text-sm text-zinc-300">{viewing.excerpt}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Content</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{viewing.content}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Slug</p>
                <p className="mt-1 text-sm text-zinc-300">/{viewing.slug}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Meta title</p>
                <p className="mt-1 text-sm text-zinc-300">{viewing.metaTitle || "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Meta description</p>
                <p className="mt-1 text-sm text-zinc-300">{viewing.metaDescription || "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Keywords</p>
                <p className="mt-1 text-sm text-zinc-300">{viewing.metaKeywords || "—"}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                title="Edit"
                className={adminIconBtn}
                onClick={() => {
                  setEditing(viewing);
                  setTitleForSlug(viewing.title);
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
            ? `This will permanently delete “${deleteTarget.title}”. This action cannot be undone.`
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
