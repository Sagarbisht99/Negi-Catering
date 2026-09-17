"use client";

import {
  deleteEnquiry,
  listEnquiries,
  updateEnquiry,
  updateEnquiryStatus,
  type EnquiryRecord,
  type EnquiryStatus,
} from "@/app/actions/enquiries";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
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
import { occasions } from "@/data/occasions";
import { enquiryAdminSchema, zodFirstMessage } from "@/lib/validation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useMemo, useState } from "react";

const STATUS_OPTIONS: EnquiryStatus[] = ["pending", "followup", "resolved"];

const statusLabel: Record<EnquiryStatus, string> = {
  pending: "Pending",
  followup: "Follow-up",
  resolved: "Resolved",
};

const statusClass: Record<EnquiryStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  followup: "bg-sky-500/15 text-sky-400",
  resolved: "bg-emerald-500/15 text-emerald-400",
};

const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40";

export default function EnquiryManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const enquiries = useQuery({ queryKey: ["enquiries"], queryFn: listEnquiries });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | EnquiryStatus>("All");
  const [viewing, setViewing] = useState<EnquiryRecord | null>(null);
  const [editing, setEditing] = useState<EnquiryRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EnquiryRecord | null>(null);
  const [editError, setEditError] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (enquiries.data ?? []).filter((item) => {
      const itemStatus = item.status || "pending";
      const matchesStatus = statusFilter === "All" || itemStatus === statusFilter;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.mobile.toLowerCase().includes(q) ||
        item.event.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [enquiries.data, search, statusFilter]);

  const pagination = usePagination(rows);
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["enquiries"] });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) =>
      updateEnquiryStatus(id, status),
    onSuccess: async (_data, vars) => {
      await invalidate();
      setViewing((prev) => (prev && prev.id === vars.id ? { ...prev, status: vars.status } : prev));
      setEditing((prev) => (prev && prev.id === vars.id ? { ...prev, status: vars.status } : prev));
      toast.success(`Status updated to ${statusLabel[vars.status]}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const saveEdit = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!editing) return;
      const parsed = enquiryAdminSchema.safeParse({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        mobile: String(formData.get("mobile") ?? ""),
        event: String(formData.get("event") ?? ""),
        guests: String(formData.get("guests") ?? ""),
        status: String(formData.get("status") ?? "pending"),
      });
      if (!parsed.success) {
        throw new Error(zodFirstMessage(parsed.error));
      }
      await updateEnquiry(editing.id, parsed.data);
    },
    onSuccess: async () => {
      await invalidate();
      setEditing(null);
      setEditError("");
      toast.success("Enquiry updated");
    },
    onError: (err: Error) => {
      setEditError(err.message);
      toast.error(err.message);
    },
  });

  const remove = useMutation({
    mutationFn: deleteEnquiry,
    onSuccess: async () => {
      await invalidate();
      setDeleteTarget(null);
      setViewing(null);
      setEditing(null);
      toast.success("Enquiry deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditError("");
    saveEdit.mutate(new FormData(e.currentTarget));
  };

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} grid gap-4 p-4 sm:grid-cols-2`}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "All" | EnquiryStatus);
              pagination.resetPage();
            }}
            className={adminField}
          >
            <option value="All">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {statusLabel[s]}
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
            placeholder="Name, email, mobile, event"
            className={adminField}
          />
        </label>
      </div>

      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="text-base font-semibold text-white">Enquiries</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Contact form and popup leads from the website.
            </p>
          </div>
        </div>

        {enquiries.isPending ? <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p> : null}
        {enquiries.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(enquiries.error as Error).message}
          </p>
        ) : null}
        {!enquiries.isPending && !rows.length ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">No enquiries yet.</p>
        ) : null}

        {rows.length ? (
          <>
            <div className={adminTableScroll}>
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHead}>
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Event</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Guests</th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">Source</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.pageItems.map((item) => {
                    const currentStatus = item.status || "pending";
                    return (
                      <tr key={item.id} className={adminTableRow}>
                        <td className="px-5 py-3">
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="mt-0.5 block text-xs text-zinc-500">{item.mobile}</span>
                        </td>
                        <td className="px-5 py-3 text-zinc-400">{item.event}</td>
                        <td className="hidden px-5 py-3 text-zinc-400 md:table-cell">
                          {item.guests}
                        </td>
                        <td className="hidden px-5 py-3 capitalize text-zinc-500 lg:table-cell">
                          {item.source}
                        </td>
                        <td className="px-5 py-3">
                          <select
                            value={currentStatus}
                            disabled={setStatus.isPending}
                            aria-label={`Status for ${item.name}`}
                            onChange={(e) => {
                              const next = e.target.value as EnquiryStatus;
                              setStatus.mutate({ id: item.id, status: next });
                            }}
                            className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ring-1 ring-white/10 ${statusClass[currentStatus]}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {statusLabel[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View"
                              aria-label="View enquiry"
                              className={iconBtn}
                              onClick={() => setViewing(item)}
                            >
                              <ViewIcon />
                            </button>
                            <button
                              type="button"
                              title="Edit"
                              aria-label="Edit enquiry"
                              className={iconBtn}
                              onClick={() => {
                                setEditing(item);
                                setEditError("");
                              }}
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              aria-label="Delete enquiry"
                              className={`${iconBtn} hover:border-red-500/30 hover:text-red-400`}
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
              <div>
                <h2 className="text-xl font-semibold text-white">{viewing.name}</h2>
                <p className="mt-1 text-sm capitalize text-zinc-500">{viewing.source} enquiry</p>
              </div>
              <button type="button" onClick={() => setViewing(null)} className={adminGhost}>
                Close
              </button>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">Status</span>
              <select
                value={viewing.status || "pending"}
                disabled={setStatus.isPending}
                onChange={(e) => {
                  const next = e.target.value as EnquiryStatus;
                  setViewing({ ...viewing, status: next });
                  setStatus.mutate({ id: viewing.id, status: next });
                }}
                className={adminField}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
            </label>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Email</dt>
                <dd className="mt-1 text-zinc-200">
                  <a href={`mailto:${viewing.email}`} className="hover:text-white">
                    {viewing.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Mobile</dt>
                <dd className="mt-1 text-zinc-200">
                  <a href={`tel:${viewing.mobile}`} className="hover:text-white">
                    {viewing.mobile}
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Event</dt>
                  <dd className="mt-1 text-zinc-200">{viewing.event}</dd>
                </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Guests</dt>
                <dd className="mt-1 text-zinc-200">{viewing.guests}</dd>
              </div>
              </div>
              {viewing.createdAt ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">Received</dt>
                  <dd className="mt-1 text-zinc-400">
                    {new Date(viewing.createdAt).toLocaleString()}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className={iconBtn}
                title="Edit"
                onClick={() => {
                  setEditing(viewing);
                  setViewing(null);
                  setEditError("");
                }}
              >
                <EditIcon />
              </button>
              <button
                type="button"
                className={`${iconBtn} hover:border-red-500/30 hover:text-red-400`}
                title="Delete"
                onClick={() => setDeleteTarget(viewing)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editing ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setEditing(null)}
        >
          <form
            onSubmit={onEditSubmit}
            noValidate
            className="scrollbar-admin max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl bg-[#141414] p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white">Edit enquiry</h2>
            <input
              name="name"
              required
              defaultValue={editing.name}
              placeholder="Name"
              className={adminField}
            />
            <input
              name="email"
              type="email"
              required
              defaultValue={editing.email}
              placeholder="Email"
              className={adminField}
            />
            <input
              name="mobile"
              required
              defaultValue={editing.mobile}
              placeholder="Mobile"
              className={adminField}
            />
            <select
              name="event"
              required
              defaultValue={editing.event}
              className={adminField}
            >
              {occasions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <input
              name="guests"
              type="number"
              min={1}
              required
              defaultValue={editing.guests}
              placeholder="Guests"
              className={adminField}
            />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">Status</span>
              <select
                name="status"
                required
                defaultValue={editing.status || "pending"}
                className={adminField}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel[s]}
                  </option>
                ))}
              </select>
            </label>
            {editError ? <p className="text-sm font-semibold text-terracotta">{editError}</p> : null}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className={adminGhost}>
                Cancel
              </button>
              <button type="submit" disabled={saveEdit.isPending} className={adminBtn}>
                {saveEdit.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Are you sure to delete?"
        message={
          deleteTarget
            ? `This will permanently delete the enquiry from “${deleteTarget.name}”.`
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

function ViewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M13 6.5 17.5 11" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 7h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M7.5 7 8.2 19a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4L16.5 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
