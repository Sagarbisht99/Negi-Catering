import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function isExternalSrc(src: string) {
  return (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

export default function MediaImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: Props) {
  const unoptimized = isExternalSrc(src);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        quality={90}
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
      quality={90}
      unoptimized={unoptimized}
      className={className}
    />
  );
}
