"use client";

import { useEnquiry } from "@/components/EnquiryProvider";
import { phoneHref, site, whatsappHref } from "@/data/site";

export default function FloatingActions() {
  const { openEnquiry, submitted } = useEnquiry();

  return (
    <>
      {submitted ? null : (
        <button
          type="button"
          onClick={() => openEnquiry()}
          aria-label="Get a quote"
          className="fixed top-1/2 left-0 z-[90] hidden -translate-y-1/2 flex-col items-center gap-2 rounded-r-lg bg-terracotta px-2.5 py-4 text-white shadow-lg shadow-terracotta/30 transition hover:bg-terracotta-dark md:flex"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15">
            <QuoteIcon />
          </span>
          <span className="font-headline [writing-mode:vertical-rl] rotate-180 text-[11px] font-extrabold tracking-[0.18em] uppercase">
            Get a Quote
          </span>
        </button>
      )}

      <div className="fixed right-3 bottom-16 z-[90] flex flex-col gap-3 md:right-6 md:bottom-16">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat on WhatsApp — ${site.contact.phoneDisplay}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition hover:scale-105 hover:bg-[#1ebe57] md:h-14 md:w-14"
        >
          <WhatsAppIcon />
        </a>
        <a
          href={phoneHref()}
          aria-label={`Call ${site.brand.name} — ${site.contact.phoneDisplay}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-white shadow-lg shadow-terracotta/30 transition hover:scale-105 hover:bg-terracotta-dark md:h-14 md:w-14"
        >
          <PhoneIcon />
        </a>
      </div>
    </>
  );
}

function QuoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7.5A3.5 3.5 0 0 1 7.5 4H9v3.2A3.3 3.3 0 0 1 5.7 10.5H4V7.5Zm11 0A3.5 3.5 0 0 1 18.5 4H20v3.2a3.3 3.3 0 0 1-3.3 3.3H15V7.5ZM4 16.5A3.5 3.5 0 0 1 7.5 13H9v3.2A3.3 3.3 0 0 1 5.7 19.5H4V16.5Zm11 0A3.5 3.5 0 0 1 18.5 13H20v3.2a3.3 3.3 0 0 1-3.3 3.3H15V16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.05 15.05 0 0 1-6.59-6.59l1.85-1.85c.43-.42.64-1.03.55-1.64l-.29-2.52A2 2 0 0 0 6.76 3H5.03C3.9 3 2.97 3.96 3.03 5.09c.4 8.07 6.83 14.49 14.9 14.89 1.13.06 2.07-.87 2.07-2v-1.73c0-1.01-.75-1.86-1.77-1.99z" />
    </svg>
  );
}
