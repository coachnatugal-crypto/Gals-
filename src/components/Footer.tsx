import Image from "next/image";
import { INSTAGRAM, NAV_LINKS, WHATSAPP_COMMUNITY_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gals-silver/30 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <a
            href="/"
            className="flex h-16 w-52 items-center overflow-hidden sm:h-20 sm:w-64"
          >
            <Image
              src="/brand/logos/logo.png"
              alt="GAL'S Studio"
              width={320}
              height={128}
              className="h-full w-full scale-[2.55] object-contain"
            />
          </a>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gals-muted">
            Movimiento con propósito y profundidad para volver a ti. Chicó
            Reservado, Bogotá.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-gals-ink">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
          >
            Comunidad WhatsApp
          </a>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-60"
          >
            Instagram
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 md:px-8">
        <p className="text-xs text-gals-muted">
          © {new Date().getFullYear()} GAL&apos;S Studio. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
