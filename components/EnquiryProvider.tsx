"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import EnquiryModal from "@/components/EnquiryModal";
import type { Occasion } from "@/data/occasions";
import {
  hasSubmittedEnquiry,
  markEnquirySubmitted,
  subscribeEnquirySubmitted,
} from "@/lib/enquirySubmitted";

const SUCCESS_MS = 4500;

type EnquiryContextValue = {
  openEnquiry: (event?: Occasion | "") => void;
  submitted: boolean;
  notifyEnquirySuccess: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<Occasion | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    const sync = () => setSubmitted(hasSubmittedEnquiry());
    sync();
    return subscribeEnquirySubmitted(sync);
  }, []);

  useEffect(() => {
    if (!successOpen) return;
    const timer = window.setTimeout(() => setSuccessOpen(false), SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [successOpen]);

  const openEnquiry = useCallback((selected: Occasion | "" = "") => {
    if (hasSubmittedEnquiry()) return;
    setEvent(selected);
    setOpen(true);
  }, []);

  const notifyEnquirySuccess = useCallback(() => {
    setOpen(false);
    markEnquirySubmitted();
    setSuccessOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openEnquiry, submitted, notifyEnquirySuccess }),
    [openEnquiry, submitted, notifyEnquirySuccess],
  );

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      {!submitted ? (
        <EnquiryModal
          open={open}
          initialEvent={event}
          onClose={() => setOpen(false)}
        />
      ) : null}
      {successOpen ? <EnquirySuccessNotice /> : null}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used within EnquiryProvider");
  }
  return ctx;
}

function EnquirySuccessNotice() {
  return (
    <div className="fixed inset-x-0 bottom-6 z-[130] flex justify-center px-4 pointer-events-none sm:bottom-8">
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-card px-4 py-4 shadow-xl ring-1 ring-leaf/25 animate-fade-up sm:px-5">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold text-ink">Thank you!</p>
          <p className="mt-0.5 text-sm leading-relaxed text-muted">
            We received your enquiry. We will reach out to you soon.
          </p>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
            <div className="enquiry-success-bar h-full rounded-full bg-leaf" />
          </div>
        </div>
      </div>
    </div>
  );
}
