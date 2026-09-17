import Image from "next/image";

export default function AdminImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 text-xs text-zinc-500 ${className ?? ""}`}
        aria-label={alt}
      >
        No image
      </div>
    );
  }

  const unoptimized =
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://");

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      quality={90}
      unoptimized={unoptimized}
      className={className}
    />
  );
}
