"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID, trackMeta } from "@/lib/meta-pixel";

/**
 * Código base del Pixel + PageView en navegación SPA
 * + ViewContent en páginas clave + Contact al abrir WP Free.
 */
export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // PageView solo aquí (SPA). El script base hace init sin PageView para evitar doble conteo.
    trackMeta("PageView");

    const path = pathname || "/";
    if (path.startsWith("/programa")) {
      trackMeta("ViewContent", {
        content_name: "pagina_reto_7_dias",
        content_category: "programa",
      });
    } else if (path.startsWith("/alimentacion")) {
      trackMeta("ViewContent", {
        content_name: "pagina_alimentacion_gratis",
        content_category: "alimentacion",
      });
    } else if (path.startsWith("/eventos")) {
      trackMeta("ViewContent", {
        content_name: "pagina_eventos",
        content_category: "eventos",
      });
    }
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const a = el.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.includes("chat.whatsapp.com")) {
        trackMeta("Contact", {
          content_name: "comunidad_whatsapp_free",
          content_category: "whatsapp",
        });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
`}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
