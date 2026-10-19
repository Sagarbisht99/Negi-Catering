"use client";

import {
  deleteApplication,
  listApplications,
  updateApplicationStatus,
  type ApplicationRecord,
  type ApplicationStatus,
} from "@/app/actions/applications";
import AdminPagination from "@/components/admin/AdminPagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import {
  adminField,
  adminPanel,
  adminTableHead,
  adminTableRow,
  adminTableScroll,
} from "@/components/admin/adminStyles";
import { usePagination } from "@/components/admin/usePagination";
import { useToast } from "@/components/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "pending",
  "shortlisted",
  "rejected",
];

const statusLabel: Record<ApplicationStatus, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

const statusClass: Record<ApplicationStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  shortlisted: "bg-sky-500/15 text-sky-400",
  rejected: "bg-rose-500/15 text-rose-400",
};

const iconBtn =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40";

export default function ApplicationManager() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const applications = useQuery({
    queryKey: ["applications"],
    queryFn: listApplications,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicationStatus>(
    "All",
  );
  const [viewing, setViewing] = useState<ApplicationRecord | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ApplicationRecord | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (applications.data ?? []).filter((item) => {
      const itemStatus = item.status || "pending";
      const matchesStatus =
        statusFilter === "All" || itemStatus === statusFilter;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.mobile.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications.data, search, statusFilter]);

  const pagination = usePagination(rows);
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["applications"] });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      updateApplicationStatus(id, status),
    onSuccess: async (_data, vars) => {
      await invalidate();
      setViewing((prev) =>
        prev && prev.id === vars.id ? { ...prev, status: vars.status } : prev,
      );
      toast.success(`Status updated to ${statusLabel[vars.status]}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: deleteApplication,
    onSuccess: async () => {
      await invalidate();
      setDeleteTarget(null);
      setViewing(null);
      toast.success("Application deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <section className="space-y-5">
      <div className={`${adminPanel} grid gap-4 p-4 sm:grid-cols-2`}>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Status
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "All" | ApplicationStatus);
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
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">
            Search
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pagination.resetPage();
            }}
            placeholder="Name, email, mobile, role"
            className={adminField}
          />
        </label>
      </div>

      <div className={`${adminPanel} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="text-base font-semibold text-white">Applications</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Job applications submitted from the careers page.
            </p>
          </div>
        </div>

        {applications.isPending ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">Loading...</p>
        ) : null}
        {applications.error ? (
          <p className="px-5 pb-5 text-sm font-semibold text-terracotta">
            {(applications.error as Error).message}
          </p>
        ) : null}
        {!applications.isPending && !rows.length ? (
          <p className="px-5 pb-5 text-sm text-zinc-500">
            No applications yet.
          </p>
        ) : null}

        {rows.length ? (
          <>
            <div className={adminTableScroll}>
              <table className="min-w-full text-left text-sm">
                <thead className={adminTableHead}>
                  <tr>
                    <th className="px-5 py-3 font-medium">Applicant</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Resume
                    </th>
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
                          <span className="font-medium text-white">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-zinc-500">
                            {item.email}
                          </span>
                          <span className="block text-xs text-zinc-600">
                            {item.mobile}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-zinc-300">{item.role}</td>
                        <td className="hidden px-5 py-3 md:table-cell">
                          <ResumeLink item={item} />
                        </td>
                        <td className="px-5 py-3">
                          <select
                            value={currentStatus}
                            disabled={setStatus.isPending}
                            aria-label={`Status for ${item.name}`}
                            onChange={(e) => {
                              const next = e.target.value as ApplicationStatus;
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
                              aria-label="View application"
                              className={iconBtn}
                              onClick={() => setViewing(item)}
                            >
                              <ViewIcon />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              aria-label="Delete application"
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
                <h2 className="text-xl font-semibold text-white">
                  {viewing.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Applied for {viewing.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-400">
                Status
              </span>
              <select
                value={viewing.status || "pending"}
                disabled={setStatus.isPending}
                onChange={(e) => {
                  const next = e.target.value as ApplicationStatus;
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
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Email
                </dt>
                <dd className="mt-1 text-zinc-200">
                  <a
                    href={`mailto:${viewing.email}`}
                    className="hover:text-white"
                  >
                    {viewing.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Mobile
                </dt>
                <dd className="mt-1 text-zinc-200">
                  <a
                    href={`tel:${viewing.mobile}`}
                    className="hover:text-white"
                  >
                    {viewing.mobile}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-zinc-500">
                  Resume
                </dt>
                <dd className="mt-1 text-zinc-200">
                  <ResumeLink item={viewing} />
                </dd>
              </div>
              {viewing.createdAt ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-zinc-500">
                    Received
                  </dt>
                  <dd className="mt-1 text-zinc-400">
                    {new Date(viewing.createdAt).toLocaleString()}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="flex justify-end gap-2">
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Are you sure to delete?"
        message={
          deleteTarget
            ? `This will permanently delete the application from “${deleteTarget.name}” and its resume file.`
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

function ResumeLink({ item }: { item: ApplicationRecord }) {
  return (
    <a
      href={item.resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-[220px] items-center gap-1.5 text-zinc-300 transition hover:text-white"
    >
      <DocumentIcon />
      <span className="truncate">{item.resumeName || "Resume"}</span>
    </a>
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

function DeleteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 7V5h6v2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M7.5 7 8.2 19a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4L16.5 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h6.5L18.5 8v11A1.5 1.5 0 0 1 17 20.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13 3.5V8h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
