"use client";

import { occasions, type Occasion } from "@/data/occasions";
import { useSubmitEnquiry } from "@/lib/publicQueries";
import { useEnquiry } from "@/components/EnquiryProvider";
import { enquiryFormSchema, zodFieldErrors, type FieldErrors } from "@/lib/validation";
import { FormEvent, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20";

const empty = {
  name: "",
  email: "",
  mobile: "",
  event: "" as Occasion | "",
  guests: "",
};

export default function ContactForm() {
  const { submitted, notifyEnquirySuccess } = useEnquiry();
  const submit = useSubmitEnquiry();
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState<FieldErrors>({});
  const [form, setForm] = useState(empty);

  const update = (patch: Partial<typeof empty>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setFieldErr({});
    setError("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = enquiryFormSchema.safeParse({
      ...form,
      source: "contact",
    });
    if (!parsed.success) {
      setFieldErr(zodFieldErrors(parsed.error));
      return;
    }

    submit.mutate(parsed.data, {
      onSuccess: () => {
        setFieldErr({});
        notifyEnquirySuccess();
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      },
    });
  };

  if (submitted) return null;

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
            Event
          </span>
          <select
            className={fieldClass}
            value={form.event}
            onChange={(e) =>
              update({ event: e.target.value as Occasion | "" })
            }
          >
            <option value="" disabled>
              Select event
            </option>
            {occasions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {fieldErr.event ? <FieldHint>{fieldErr.event}</FieldHint> : null}
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Number of Guests
          </span>
          <input
            type="number"
            min={1}
            className={fieldClass}
            value={form.guests}
            onChange={(e) => update({ guests: e.target.value })}
            placeholder="How many people?"
          />
          {fieldErr.guests ? <FieldHint>{fieldErr.guests}</FieldHint> : null}
        </label>
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
        {submit.isPending ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}

function FieldHint({ children }: { children: string }) {
  return <p className="mt-1.5 text-xs font-semibold text-terracotta">{children}</p>;
}
