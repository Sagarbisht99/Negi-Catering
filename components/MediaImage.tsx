import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

function needsUnoptimized(src: string) {
  // Next can optimize http(s) remotes listed in next.config remotePatterns.
  // Only skip the optimizer for inline / temporary blob URLs.
  return src.startsWith("data:") || src.startsWith("blob:");
}

export default function MediaImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  quality = 75,
}: Props) {
  if (!src) return null;

  const unoptimized = needsUnoptimized(src);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
        quality={quality}
        unoptimized={unoptimized}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority={priority}
      quality={quality}
      unoptimized={unoptimized}
      className={className}
      sizes={sizes}
    />
  );
}
