import Image, { type ImageProps } from "next/image";

type PhotoProps = Omit<ImageProps, "src"> & { src: string; position?: string };

/**
 * Wrapper next/image. SVG placeholder tidak dioptimasi (Next.js tidak memproses SVG),
 * foto JPG/WebP asli nanti otomatis dioptimasi.
 */
export function Photo({ src, alt, position, style, className, ...rest }: PhotoProps) {
  const isSvg = src.endsWith(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={isSvg}
      className={className ?? "object-cover"}
      style={position ? { objectPosition: position, ...style } : style}
      {...rest}
    />
  );
}
