import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import { site } from "@/data/site";
import Link from "next/link";

type Section = {
  title: string;
  body: string[];
};

type Props = {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
  breadcrumb?: Crumb[];
};

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
  breadcrumb,
}: Props) {
  return (
    <div className="pb-8">
      <section className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-3xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
          {breadcrumb?.length ? (
            <Breadcrumb items={breadcrumb} className="mb-4" />
          ) : (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-terracotta">
              Legal
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            {intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-8 px-3 py-8 sm:px-4 md:px-6 md:py-14">
        {sections.map((section) => (
          <article key={section.title}>
            <h2 className="font-display text-2xl font-semibold text-ink">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3">
              {section.body.map((para) => (
                <p key={para} className="text-sm leading-relaxed text-muted md:text-[15px]">
                  {para}
                </p>
              ))}
            </div>
          </article>
        ))}

        <div className="rounded-2xl bg-card p-5 ring-1 ring-line">
          <p className="text-sm text-muted">
            Questions? Reach {site.brand.name} at{" "}
            <a href={`mailto:${site.contact.email}`} className="font-semibold text-terracotta">
              {site.contact.email}
            </a>{" "}
            or visit our{" "}
            <Link href="/contact" className="font-semibold text-terracotta">
              Contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
