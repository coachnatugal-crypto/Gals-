"use client";

import Image from "next/image";

export function Footer() {
  return (
    <footer id="page-end" className="border-t border-gals-silver/30 bg-white py-5">
      <div className="mx-auto flex max-w-6xl justify-center px-5 md:px-8">
        <a
          href="/"
          className="flex h-14 w-44 items-center overflow-hidden sm:h-16 sm:w-52"
        >
          <Image
            src="/brand/logos/logo.png"
            alt="GAL'S Studio"
            width={320}
            height={128}
            className="h-full w-full scale-[2.55] object-contain"
          />
        </a>
      </div>
    </footer>
  );
}
