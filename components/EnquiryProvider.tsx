"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import EnquiryModal from "@/components/EnquiryModal";
import type { Occasion } from "@/data/occasions";

type EnquiryContextValue = {
  openEnquiry: (event?: Occasion | "") => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [event, setEvent] = useState<Occasion | "">("");

  const openEnquiry = useCallback((selected: Occasion | "" = "") => {
    setEvent(selected);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal
        open={open}
        initialEvent={event}
        onClose={() => setOpen(false)}
      />
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
