"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_LINKS, INSTAGRAM, WHATSAPP_COMMUNITY_URL } from "@/lib/constants";
import { BEWE_BOOK_CLASS } from "@/lib/bewe";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74 1.72.75 2.09.82 2.84.69.43-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const lightNav = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] w-full max-w-[100vw] overflow-x-clip transition-all duration-300 ${
          scrolled || !isHome
            ? "bg-gals-cream/95 py-2.5 shadow-[0_1px_0_rgba(26,42,53,0.06)] backdrop-blur-md"
            : "bg-gals-cream py-3.5 md:bg-transparent md:py-4"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 pl-5 pr-4 sm:gap-4 sm:px-5 md:px-8">
          <Link
            href="/"
            className="relative z-50 flex h-11 w-[9.5rem] shrink-0 items-center justify-start overflow-visible sm:h-14 sm:w-40 lg:h-14 lg:w-44"
          >
            <Image
              src="/brand/logos/logo.png"
              alt="GAL'S Studio"
              width={320}
              height={128}
              priority
              className={`h-full w-full origin-left scale-[1.75] object-contain object-left sm:origin-center sm:scale-[2.5] lg:scale-[2.55] ${
                lightNav ? "md:brightness-0 md:invert" : ""
              }`}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {MENU_LINKS.map((link) => {
              const isRoute =
                link.href.startsWith("/") && !link.href.startsWith("/#");
              const active = isRoute
                ? pathname === link.href
                : isHome && link.href.startsWith("/#");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display text-xs tracking-[0.18em] uppercase transition-opacity hover:opacity-60 ${
                    lightNav
                      ? "text-white drop-shadow"
                      : "text-gals-blue-deep"
                  } ${active && isRoute ? "underline underline-offset-4" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <a
              href={isHome ? "#horario" : "/#horario"}
              className={`${BEWE_BOOK_CLASS} inline-flex rounded-full px-5 py-2.5 font-display text-[11px] tracking-[0.14em] uppercase transition-transform hover:scale-[1.03] ${
                lightNav
                  ? "bg-white text-gals-blue-deep shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                  : "bg-gals-blue-deep text-white shadow-[0_8px_20px_rgba(26,42,53,0.18)]"
              }`}
            >
              Reservar
            </a>
          </div>
          <div className="relative z-50 flex shrink-0 items-center gap-0.5 lg:hidden">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de GAL'S"
              className="flex h-10 w-10 items-center justify-center text-gals-blue-deep transition-opacity hover:opacity-70"
            >
              <InstagramIcon className="h-[1.15rem] w-[1.15rem]" />
            </a>
            <a
              href={WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Comunidad de WhatsApp GAL'S"
              className="flex h-10 w-10 items-center justify-center text-gals-blue-deep transition-opacity hover:opacity-70"
            >
              <WhatsAppIcon className="h-[1.2rem] w-[1.2rem]" />
            </a>
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className="-mr-1 flex h-11 w-11 flex-col items-center justify-center gap-[5px] text-gals-blue-deep"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={`block h-[2.5px] w-6 rounded-full bg-gals-blue-deep transition-transform ${
                  open ? "translate-y-[7.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2.5px] w-6 rounded-full bg-gals-blue-deep transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2.5px] w-6 rounded-full bg-gals-blue-deep transition-transform ${
                  open ? "-translate-y-[7.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fuera del header: overflow-x-clip rompía fixed inset-0 en móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-gals-cream/55 backdrop-blur-md lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            onClick={() => setOpen(false)}
          >
            <nav
              className="flex flex-col items-center px-6 pt-24 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full max-w-xs flex-col items-center gap-5">
                {MENU_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-xl tracking-[0.16em] text-gals-blue-deep uppercase drop-shadow-sm"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.a
                  href={isHome ? "#horario" : "/#horario"}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * MENU_LINKS.length }}
                  className={`${BEWE_BOOK_CLASS} mt-2 inline-flex rounded-full bg-gals-blue-deep px-8 py-3.5 font-display text-sm tracking-[0.14em] text-white uppercase`}
                >
                  Reservar clase
                </motion.a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
