"use client";

type Props = {
  onClick: () => void;
};

export default function EnquiryHangTag({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Enquiry now"
      className="group absolute top-full left-1/2 z-40 -translate-x-1/2 outline-none"
    >
      <span className="animate-hang flex flex-col items-center will-change-transform">
        <span className="relative flex h-11 w-px items-center justify-center bg-line">
          <span className="absolute top-1.5 h-2 w-2 rounded-full bg-card shadow-sm ring-1 ring-line" />
          <span className="absolute top-[18px] h-2 w-2 rounded-full bg-ivory-deep shadow-sm ring-1 ring-line" />
          <span className="absolute top-[30px] h-2 w-2 rounded-full bg-card shadow-sm ring-1 ring-line" />
        </span>

        <span className="relative rounded-xl bg-terracotta px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white shadow-lg shadow-terracotta/30 transition group-hover:bg-terracotta-dark md:text-xs">
          <span className="pointer-events-none absolute top-1.5 left-1.5 text-[9px] font-normal text-white/55">
            +
          </span>
          <span className="pointer-events-none absolute top-1.5 right-1.5 text-[9px] font-normal text-white/55">
            +
          </span>
          <span className="pointer-events-none absolute bottom-1.5 left-1.5 text-[9px] font-normal text-white/55">
            +
          </span>
          <span className="pointer-events-none absolute right-1.5 bottom-1.5 text-[9px] font-normal text-white/55">
            +
          </span>
          Enquiry Now
        </span>
      </span>
    </button>
  );
}
