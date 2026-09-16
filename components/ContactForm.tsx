"use client";

import { occasions, type Occasion } from "@/data/occasions";
import { FormEvent, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    event: "" as Occasion | "",
    guests: "",
    message: "",
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-line">
        <p className="font-display text-3xl font-semibold text-ink">Thank you!</p>
        <p className="mt-2 text-sm text-muted">
          Your message has been received. We&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({
              name: "",
              email: "",
              mobile: "",
              event: "",
              guests: "",
              message: "",
            });
          }}
          className="mt-6 rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-line md:p-7"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Name
          </span>
          <input
            required
            className={fieldClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Email
          </span>
          <input
            required
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@email.com"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Mobile Number
          </span>
          <input
            required
            type="tel"
            pattern="[0-9+\-\s]{10,15}"
            className={fieldClass}
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            placeholder="10-digit mobile number"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Event
          </span>
          <select
            required
            className={fieldClass}
            value={form.event}
            onChange={(e) =>
              setForm({ ...form, event: e.target.value as Occasion | "" })
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
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Kitne logo ka khana?
          </span>
          <input
            required
            type="number"
            min={1}
            className={fieldClass}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            placeholder="Number of guests"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Message
          </span>
          <textarea
            rows={4}
            className={fieldClass}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Date, location, menu preferences..."
          />
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-terracotta py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-terracotta-dark md:w-auto md:px-10"
      >
        Send Message
      </button>
    </form>
  );
}
