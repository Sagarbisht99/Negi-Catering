"use client";

import { faqItems } from "@/data/faq";
import { site } from "@/data/site";
import Link from "next/link";
import { useState } from "react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const mid = Math.ceil(faqItems.length / 2);
  const columns = [faqItems.slice(0, mid), faqItems.slice(mid)];

  return (
    <section
      id="faq"
      className="border-y border-line bg-ivory-deep/40 py-10 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
            Help Centre
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-muted md:text-base">
            Quick answers about booking, menus, and how {site.brand.name} works.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-5">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-3">
              {column.map((item, itemIndex) => {
                const index = colIndex === 0 ? itemIndex : mid + itemIndex;
                const open = openIndex === index;
                return (
                  <div
                    key={item.question}
                    className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-line"
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-bold text-ink md:text-base">
                        {item.question}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition ${
                          open
                            ? "bg-terracotta text-white"
                            : "bg-ivory text-terracotta ring-1 ring-line"
                        }`}
                      >
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open ? (
                      <div className="border-t border-line px-5 py-4">
                        <p className="text-sm leading-relaxed text-muted">
                          {item.answer}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] bg-terracotta px-5 py-8 text-white sm:px-6 md:flex md:items-center md:justify-between md:px-10 md:py-10">
          <div>
            <h3 className="font-display text-xl font-semibold sm:text-2xl">
              Still have a question?
            </h3>
            <p className="mt-1 text-sm text-white/90">
              Write to us — we usually reply the same day.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex w-full justify-center rounded-full bg-card px-6 py-3 text-sm font-bold text-terracotta transition hover:bg-ivory md:mt-0 md:w-auto"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
