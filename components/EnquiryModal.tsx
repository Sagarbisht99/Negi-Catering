"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import { occasions, type Occasion } from "@/data/occasions";
import { site } from "@/data/site";
import { useSubmitEnquiry } from "@/lib/publicQueries";
import { enquiryFormSchema, zodFieldErrors, type FieldErrors } from "@/lib/validation";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Props = {
  open: boolean;
  initialEvent?: Occasion | "";
  onClose: () => void;
};

const empty = {
  name: "",
  email: "",
  mobile: "",
  event: "" as Occasion | "",
  guests: "",
};

export default function EnquiryModal({ open, initialEvent = "", onClose }: Props) {
  const { notifyEnquirySuccess } = useEnquiry();
  const submit = useSubmitEnquiry();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [fieldErr, setFieldErr] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;
    setForm({ ...empty, event: initialEvent });
    setError("");
    setFieldErr({});
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, initialEvent, onClose]);

  if (!open) return null;

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
      source: "popup",
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

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enquiry form"
    >
      <div
        className="relative flex max-h-[min(92dvh,760px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-gradient-to-b from-card via-card to-[#fff7f0] shadow-2xl ring-1 ring-line sm:max-w-[420px] sm:rounded-[28px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-lg text-muted shadow-sm ring-1 ring-line transition hover:bg-ivory-deep hover:text-ink"
        >
          ×
        </button>

        <div className="shrink-0 border-b border-line/70 px-5 pb-4 pt-5 text-center md:px-7 md:pt-7">
          <Image
            src={site.brand.logo}
            alt={site.brand.name}
            width={80}
            height={74}
            className="mx-auto h-[64px] w-auto object-contain"
            priority
          />
          <h2 className="mt-2 font-display text-[1.5rem] font-semibold leading-tight text-ink sm:text-[1.65rem]">
            Let&apos;s plan your catering
          </h2>
          <p className="mt-1 text-sm text-muted">
            Free enquiry with {site.brand.name}
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="scrollbar-thin min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4 md:px-7">
            <label className="relative block">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-terracotta">
                <UserIcon />
              </span>
              <input
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                className="field-pill"
                placeholder="Enter Your Name *"
              />
              {fieldErr.name ? <FieldHint>{fieldErr.name}</FieldHint> : null}
            </label>

            <label className="relative block">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-terracotta">
                <MailIcon />
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
                className="field-pill"
                placeholder="Enter Email Address *"
              />
              {fieldErr.email ? <FieldHint>{fieldErr.email}</FieldHint> : null}
            </label>

            <div>
              <label className="relative flex overflow-hidden rounded-full border border-line bg-card transition focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/20">
                <span className="flex items-center gap-1.5 border-r border-line bg-ivory/80 px-3 text-sm font-semibold text-ink">
                  <span className="text-terracotta">
                    <PhoneIcon />
                  </span>
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) =>
                    update({
                      mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ink outline-none"
                  placeholder="Mobile Number *"
                />
              </label>
              {fieldErr.mobile ? <FieldHint>{fieldErr.mobile}</FieldHint> : null}
            </div>

            <label className="relative block">
              <span className="pointer-events-none absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-terracotta">
                <EventIcon />
              </span>
              <select
                value={form.event}
                onChange={(e) =>
                  update({ event: e.target.value as Occasion | "" })
                }
                className="field-pill appearance-none pr-10"
              >
                <option value="" disabled>
                  Select Your Event *
                </option>
                {occasions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
                ▾
              </span>
              {fieldErr.event ? <FieldHint>{fieldErr.event}</FieldHint> : null}
            </label>

            <label className="relative block">
              <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-terracotta">
                <GuestsIcon />
              </span>
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => update({ guests: e.target.value })}
                className="field-pill"
                placeholder="Number of Guests *"
              />
              {fieldErr.guests ? <FieldHint>{fieldErr.guests}</FieldHint> : null}
            </label>

            {error ? (
              <p className="rounded-xl bg-terracotta/10 px-3 py-2 text-center text-sm font-semibold text-terracotta">
                {error}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-line/70 bg-card/90 px-5 py-4 backdrop-blur-sm md:px-7">
            <p className="mb-3 text-center text-[11px] leading-relaxed text-muted">
              By submitting, you agree to our{" "}
              <Link
                href="/terms"
                onClick={onClose}
                className="font-semibold text-terracotta hover:underline"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                onClick={onClose}
                className="font-semibold text-terracotta hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <button
              type="submit"
              disabled={submit.isPending}
              className="w-full rounded-full bg-terracotta py-3.5 text-sm font-bold text-white shadow-lg shadow-terracotta/30 transition hover:bg-terracotta-dark disabled:opacity-60"
            >
              {submit.isPending ? "Sending..." : "Get free quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldHint({ children }: { children: string }) {
  return <p className="mt-1.5 px-1 text-xs font-semibold text-terracotta">{children}</p>;
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 3.2c.4-.4 1.1-.5 1.6-.2l2.1 1.2c.5.3.7.9.5 1.4l-.8 2.1c-.1.4 0 .8.3 1.1l2.6 2.6c.3.3.7.4 1.1.3l2.1-.8c.5-.2 1.1 0 1.4.5l1.2 2.1c.3.5.2 1.2-.2 1.6l-1.3 1.3c-.5.5-1.2.7-1.9.5-1.8-.5-3.9-2-5.9-4s-3.5-4.1-4-5.9c-.2-.7 0-1.4.5-1.9l1.3-1.3z" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3.5 18.5c1.2-2.4 3.2-3.6 5.5-3.6s4.3 1.2 5.5 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 15.2c1.3-.5 2.7-.4 4.2.6.8.5 1.4 1.3 1.8 2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
