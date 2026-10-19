"use client";

import {
  RESUME_ACCEPT,
  RESUME_EXTENSIONS,
  RESUME_MAX_BYTES,
  careerRoles,
  type CareerRole,
} from "@/data/careers";
import { site } from "@/data/site";
import { useSubmitApplication } from "@/lib/publicQueries";
import {
  careerFormSchema,
  zodFieldErrors,
  type FieldErrors,
} from "@/lib/validation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20";

const empty = {
  name: "",
  email: "",
  mobile: "",
  role: "" as CareerRole | "",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resumeError(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!RESUME_EXTENSIONS.includes(ext)) {
    return "Resume must be a PDF, DOC, or DOCX file";
  }
  if (file.size > RESUME_MAX_BYTES) {
    return `Resume must be ${Math.round(RESUME_MAX_BYTES / 1_000_000)}MB or smaller`;
  }
  return "";
}

export default function CareerForm() {
  const submit = useSubmitApplication();
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(empty);
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);

  const update = (patch: Partial<typeof empty>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setFieldErr({});
    setError("");
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFieldErr({});
    setError("");
    if (!file) {
      setResume(null);
      return;
    }
    const problem = resumeError(file);
    if (problem) {
      setResume(null);
      setFieldErr({ resume: problem });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setResume(file);
  };

  const clearResume = () => {
    setResume(null);
    setFieldErr({});
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = careerFormSchema.safeParse(form);
    const errors: FieldErrors = parsed.success
      ? {}
      : zodFieldErrors(parsed.error);

    if (!resume) {
      errors.resume = "Please attach your resume (PDF, DOC, or DOCX)";
    }

    if (!parsed.success || Object.keys(errors).length) {
      setFieldErr(errors);
      return;
    }

    const data = new FormData();
    data.set("name", parsed.data.name);
    data.set("email", parsed.data.email);
    data.set("mobile", parsed.data.mobile);
    data.set("role", parsed.data.role);
    data.set("resume", resume as File);

    submit.mutate(data, {
      onSuccess: () => {
        setForm(empty);
        clearResume();
        setFieldErr({});
        setDone(true);
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      },
    });
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-card p-6 text-center shadow-sm ring-1 ring-line md:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
          <CheckIcon />
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
          Application received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Thank you for applying to {site.brand.name}. Our team will review your
          details and get in touch if there is a match.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-full bg-terracotta px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-line md:p-7"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Name
          </span>
          <input
            className={fieldClass}
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Your full name"
          />
          {fieldErr.name ? <FieldHint>{fieldErr.name}</FieldHint> : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Email
          </span>
          <input
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="you@email.com"
          />
          {fieldErr.email ? <FieldHint>{fieldErr.email}</FieldHint> : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Mobile Number
          </span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={fieldClass}
            value={form.mobile}
            onChange={(e) =>
              update({ mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
            }
            placeholder="10-digit mobile number"
          />
          {fieldErr.mobile ? <FieldHint>{fieldErr.mobile}</FieldHint> : null}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Role
          </span>
          <select
            className={fieldClass}
            value={form.role}
            onChange={(e) => update({ role: e.target.value as CareerRole | "" })}
          >
            <option value="" disabled>
              Select role
            </option>
            {careerRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {fieldErr.role ? <FieldHint>{fieldErr.role}</FieldHint> : null}
        </label>
      </div>

      <div className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
          Resume / CV
        </span>
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-line bg-ivory-deep/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {resume ? (
              <>
                <p className="truncate text-sm font-semibold text-ink">
                  {resume.name}
                </p>
                <p className="text-xs text-muted">{formatSize(resume.size)}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink">
                  Attach your resume
                </p>
                <p className="text-xs text-muted">
                  PDF, DOC, or DOCX · max 5MB
                </p>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-terracotta/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-terracotta transition hover:bg-terracotta/20"
            >
              {resume ? "Change" : "Choose file"}
            </button>
            {resume ? (
              <button
                type="button"
                onClick={clearResume}
                className="text-xs font-semibold text-muted transition hover:text-terracotta"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          name="resume"
          accept={RESUME_ACCEPT}
          onChange={onFileChange}
          className="sr-only"
        />
        {fieldErr.resume ? <FieldHint>{fieldErr.resume}</FieldHint> : null}
      </div>

      {error ? (
        <p className="rounded-xl bg-terracotta/10 px-3 py-2 text-sm font-semibold text-terracotta">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submit.isPending}
        className="w-full rounded-xl bg-terracotta py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark disabled:opacity-60 md:w-auto md:px-10"
      >
        {submit.isPending ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

function FieldHint({ children }: { children: string }) {
  return (
    <p className="mt-1.5 text-xs font-semibold text-terracotta">{children}</p>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8 12.5 11 15.5 16 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
