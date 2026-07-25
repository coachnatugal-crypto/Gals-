import Image from "next/image";

type LogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function Logo({
  className = "",
  width = 140,
  height = 56,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/brand/logos/logo.png"
      alt="GAL'S Studio"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${className}`}
    />
  );
}
