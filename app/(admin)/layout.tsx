export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex-1 bg-[#0a0a0a] text-zinc-100">{children}</div>
  );
}
