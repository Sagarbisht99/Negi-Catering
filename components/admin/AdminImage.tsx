import Image from "next/image";

export default function AdminImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
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
