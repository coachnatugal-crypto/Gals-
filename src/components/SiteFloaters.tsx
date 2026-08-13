"use client";

import { usePathname } from "next/navigation";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BeweChat } from "@/components/BeweChat";

/** Rutas donde no mostramos WhatsApp flotante ni Linda (reto en casa). */
const HIDE_FLOATERS = ["/programa"];

export function SiteFloaters() {
  const pathname = usePathname();
  const hide = HIDE_FLOATERS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (hide) return null;

  return (
    <>
      <WhatsAppButton />
      <BeweChat />
    </>
  );
}
