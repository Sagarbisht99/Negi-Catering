import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function MediaImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
}: Props) {
  const remote = src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://");

  if (remote) {
    return (
      // Mongo uploads are data URLs; remote URLs may also be pasted later.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={fill ? `absolute inset-0 h-full w-full object-cover ${className ?? ""}` : className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
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
      className={className}
    />
  );
}
