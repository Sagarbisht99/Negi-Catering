import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import CareerForm from "@/components/CareerForm";
import JsonLd from "@/components/JsonLd";
import { careerRoleDetails } from "@/data/careers";
import { site } from "@/data/site";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  jobPostingJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import Image from "next/image";

export const revalidate = 3600;

/** Stable dates for JobPosting schema (page revalidates, but post stays "open"). */
const POSTED_DATE = new Date().toISOString().slice(0, 10);
const VALID_THROUGH = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description: `Join ${site.brand.fullName} in New Ashok Nagar, ${site.location.label}. We are hiring helpers, cooks, and chefs — apply online with your name, contact number, role, and resume.`,
  keywords: `catering jobs ${site.location.label}, cook job Delhi, helper job New Ashok Nagar, chef job Delhi NCR, tiffin service jobs, ${site.brand.name} careers`,
  path: "/careers",
});

const perks = [
  {
    title: "Steady work",
    desc: "Daily tiffin routes plus event catering — regular hours and timely pay.",
  },
  {
    title: "Family-run team",
    desc: "Work with a kitchen family that has been cooking together since 1960.",
  },
  {
    title: "Room to grow",
    desc: "Start as a helper and grow into cooking or event catering roles.",
  },
];

export default function CareersPage() {
  return (
    <div>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/careers",
            name: `Careers | ${site.brand.fullName}`,
            description: `Apply for helper, cook, and chef jobs at ${site.brand.fullName} in New Ashok Nagar, ${site.location.label}.`,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
          ]),
          ...careerRoleDetails.map((role) =>
            jobPostingJsonLd({
              role: role.role,
              description: `${role.blurb} Role type: ${role.type}. Apply online with your resume at ${site.brand.fullName}, ${site.location.address}.`,
              datePosted: POSTED_DATE,
              validThrough: VALID_THROUGH,
            }),
          ),
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/chef.jpg"
            alt="Kitchen team at Negi Caterers and Tiffin"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-3 py-14 sm:px-4 md:px-6 md:py-24">
          <Breadcrumb variant="dark" items={[{ name: "Careers" }]} />
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            Work with {site.brand.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
            We are hiring helpers, cooks, and chefs across {site.location.label}.
            Apply below with your details and resume — our team will get in touch.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 md:px-6 md:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-terracotta">
            Open roles
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
            Pick the role that fits you
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {careerRoleDetails.map((item) => (
            <article
              key={item.role}
              className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-line"
            >
              <div className="relative h-44">
                <Image
                  src={item.image}
                  alt={`${item.role} role at ${site.brand.name}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {item.role}
                  </h3>
                  <span className="rounded-full bg-terracotta/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-terracotta">
                    {item.type}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-ivory-deep/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-3 py-10 sm:px-4 md:grid-cols-3 md:px-6 md:py-14">
          {perks.map((perk) => (
            <div key={perk.title} className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta">
                <SparkIcon />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{perk.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {perk.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-3 py-10 sm:px-4 md:grid-cols-[0.9fr_1.2fr] md:px-6 md:py-16">
        <aside className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            How to apply
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            Fill the form with your name, email, contact number, the role you
            want, and attach your resume. Your application goes straight to our
            hiring team.
          </p>
          <ul className="space-y-3 text-sm text-ink">
            {[
              "Share accurate contact details so we can reach you.",
              "Upload your resume as a PDF, DOC, or DOCX file.",
              "Shortlisted candidates are called for a quick chat.",
            ].map((step) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
          <div className="overflow-hidden rounded-2xl bg-terracotta p-6 text-white shadow-sm">
            <p className="font-display text-xl font-semibold">
              Prefer to talk first?
            </p>
            <p className="mt-2 text-sm text-white/90">
              Call {site.contact.phoneDisplay} — {site.contact.hours}.
            </p>
          </div>
        </aside>

        <div>
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink md:text-3xl">
            Apply now
          </h2>
          <CareerForm />
        </div>
      </section>
    </div>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
