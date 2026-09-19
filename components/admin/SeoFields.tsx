"use client";

import { adminField } from "@/components/admin/adminStyles";
import { slugify } from "@/lib/slug";
import { useEffect, useState } from "react";

export type SeoFieldValues = {
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

export default function SeoFields({
  defaults,
  sourceTitle,
  formKey,
}: {
  defaults?: SeoFieldValues;
  /** Name/title used to auto-generate the slug */
  sourceTitle: string;
  /** Remount key when switching create/edit */
  formKey: string;
}) {
  const initialSlug = defaults?.slug || slugify(sourceTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [manual, setManual] = useState(Boolean(defaults?.slug));

  useEffect(() => {
    setSlug(defaults?.slug || slugify(sourceTitle));
    setManual(Boolean(defaults?.slug));
  }, [formKey]); // eslint-disable-line react-hooks/exhaustive-deps -- reset only when form identity changes

  useEffect(() => {
    if (manual) return;
    setSlug(slugify(sourceTitle));
  }, [sourceTitle, manual]);

  return (
    <fieldset className="space-y-3 rounded-xl border border-white/10 p-4">
      <legend className="px-1 text-sm font-semibold text-white">SEO</legend>
      <p className="text-xs text-zinc-500">
        Used for search engines and social previews. Keywords should be
        comma-separated.
      </p>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          URL slug
        </span>
        <input
          name="slug"
          value={slug}
          onChange={(e) => {
            setManual(true);
            setSlug(slugify(e.target.value) || e.target.value.toLowerCase());
          }}
          placeholder="Auto-generated from title"
          className={adminField}
        />
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
          <span>
            {manual
              ? "Custom slug — edit freely"
              : "Auto-generated from the title as you type"}
          </span>
          {manual ? (
            <button
              type="button"
              className="font-medium text-terracotta hover:underline"
              onClick={() => {
                setManual(false);
                setSlug(slugify(sourceTitle));
              }}
            >
              Reset to auto
            </button>
          ) : null}
        </span>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Meta title
        </span>
        <input
          name="metaTitle"
          defaultValue={defaults?.metaTitle}
          placeholder="SEO title (max 70 chars)"
          maxLength={70}
          className={adminField}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Meta description
        </span>
        <textarea
          name="metaDescription"
          defaultValue={defaults?.metaDescription}
          placeholder="Short summary for Google (max 160 chars)"
          maxLength={160}
          rows={3}
          className={adminField}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Meta keywords
        </span>
        <input
          name="metaKeywords"
          defaultValue={defaults?.metaKeywords}
          placeholder="catering, tiffin, buffet, Delhi NCR"
          className={adminField}
        />
        <span className="mt-1 block text-[11px] text-zinc-500">
          Up to 15 important keywords, separated by commas
        </span>
      </label>
    </fieldset>
  );
}
