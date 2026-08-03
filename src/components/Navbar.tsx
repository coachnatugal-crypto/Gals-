"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, INSTAGRAM, WHATSAPP_COMMUNITY_URL, WHATSAPP_URL } from "@/lib/constants";

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

  const lightNav = isHome && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] w-full max-w-[100vw] overflow-x-clip transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-gals-cream/95 py-2 shadow-[0_1px_0_rgba(26,42,53,0.06)] backdrop-blur-md"
          : "bg-gals-cream py-3 md:bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-5 md:px-8">
        <Link
          href="/"
          className="relative z-50 flex h-11 w-28 shrink-0 items-center overflow-hidden sm:h-12 sm:w-36 lg:h-12 lg:w-40"
        >
          <Image
            src="/brand/logos/logo.png"
            alt="GAL'S Studio"
            width={320}
            height={128}
            priority
            className={`h-full w-full translate-y-1 scale-[2.85] object-contain object-center sm:translate-y-0.5 sm:scale-[3.1] lg:scale-[3.2] ${
              lightNav ? "md:brightness-0 md:invert" : ""
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.slice(0, 5).map((link) => {
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

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            className={`bewe-book-btn font-display text-xs tracking-[0.14em] uppercase ${
              lightNav
                ? "text-white drop-shadow"
                : "text-gals-blue-deep"
            }`}
          >
            Reservar
          </button>
          <button
            type="button"
            className={`bewe-login-btn font-display text-xs tracking-[0.14em] uppercase ${
              lightNav
                ? "text-white drop-shadow"
                : "text-gals-blue-deep"
            }`}
          >
            Mi espacio
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full border px-5 py-2 font-display text-xs tracking-[0.14em] uppercase transition-colors ${
              lightNav
                ? "border-white/80 text-white hover:bg-white hover:text-gals-blue-deep"
                : "border-gals-blue-deep text-gals-blue-deep hover:bg-gals-blue-deep hover:text-white"
            }`}
          >
            Contáctanos
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gals-cream lg:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center gap-7 px-6">
              <div className="mb-6 flex h-20 w-56 items-center justify-center overflow-hidden sm:h-24 sm:w-64">
                <Image
                  src="/brand/logos/logo.png"
                  alt="GAL'S Studio"
                  width={320}
                  height={128}
                  className="h-full w-full scale-[2.45] object-contain"
                />
              </div>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl tracking-[0.14em] text-gals-blue-deep uppercase"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="bewe-book-btn font-display text-2xl tracking-[0.14em] text-gals-blue-deep uppercase"
                onClick={() => setOpen(false)}
              >
                Reservar
              </motion.button>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="bewe-login-btn font-display text-2xl tracking-[0.14em] text-gals-blue-deep uppercase"
                onClick={() => setOpen(false)}
              >
                Mi espacio
              </motion.button>
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="mt-4 rounded-full bg-gals-blue-deep px-8 py-3.5 font-display text-sm tracking-[0.14em] text-white uppercase"
                onClick={() => setOpen(false)}
              >
                Contáctanos
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
