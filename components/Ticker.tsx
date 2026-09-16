import { site } from "@/data/site";

export default function Ticker() {
  const items = [
    "500+ Menu Options",
    `Trusted ${site.brand.sinceLabel}`,
    "Homestyle Tiffin & Catering",
    "Weddings · Parties · Offices",
    `Serving ${site.location.label}`,
  ];
  const loop = [...items, ...items];

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] overflow-hidden border-t border-line bg-terracotta py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="animate-ticker flex w-max gap-8 whitespace-nowrap px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white">
        {loop.map((text, i) => (
          <span key={`${text}-${i}`} className="inline-flex items-center gap-8">
            <span className="inline-flex items-center gap-2">
              <span className="text-white/80">•</span>
              {text}
            </span>
            <span className="text-white/40">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
