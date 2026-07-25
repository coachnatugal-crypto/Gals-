"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NAV_LINKS, WHATSAPP_URL } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gals-cream/95 py-2 shadow-[0_1px_0_rgba(26,42,53,0.06)] backdrop-blur-md"
          : "bg-gals-cream py-3 md:bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <a
          href="#inicio"
          className="relative z-50 flex h-10 w-28 shrink-0 items-center overflow-hidden sm:h-12 sm:w-36 lg:h-12 lg:w-40"
        >
          <Image
            src="/brand/logos/logo.png"
            alt="GAL'S Studio"
            width={320}
            height={128}
            priority
            className={`h-full w-full scale-[2.2] object-contain sm:scale-[2.3] lg:scale-[2.35] ${
              scrolled ? "" : "md:brightness-0 md:invert"
            }`}
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-display text-xs tracking-[0.18em] uppercase transition-opacity hover:opacity-60 ${
                scrolled ? "text-gals-blue-deep" : "text-white drop-shadow"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="#horario"
            className={`font-display text-xs tracking-[0.14em] uppercase ${
              scrolled ? "text-gals-blue-deep" : "text-white drop-shadow"
            }`}
          >
            Ver horario
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full border px-5 py-2 font-display text-xs tracking-[0.14em] uppercase transition-colors ${
              scrolled
                ? "border-gals-blue-deep text-gals-blue-deep hover:bg-gals-blue-deep hover:text-white"
                : "border-white/80 text-white hover:bg-white hover:text-gals-blue-deep"
            }`}
          >
            Contáctanos
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-gals-blue-deep lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-current transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-current transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-current transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
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
              <div className="mb-4 flex h-14 w-40 items-center justify-center overflow-hidden">
                <Image
                  src="/brand/logos/logo.png"
                  alt="GAL'S Studio"
                  width={320}
                  height={128}
                  className="h-full w-full scale-[2.3] object-contain"
                />
              </div>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="font-display text-2xl tracking-[0.14em] text-gals-blue-deep uppercase"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
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
