import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin | Negi Caterers and Tiffin" },
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex-1 bg-[#0a0a0a] text-zinc-100">{children}</div>
  );
}
