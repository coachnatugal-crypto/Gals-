import {
  ADDRESS,
  APP_DOWNLOAD_URL,
  INSTAGRAM,
  PHONE_DISPLAY,
  WHATSAPP_COMMUNITY_URL,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { ytWatch } from "@/lib/program";
import { BEWE_BOOK_CLASS, BEWE_SUBS_CLASS } from "@/lib/bewe";

export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/@Gals_nataliagalvis/videos";
export const YOUTUBE_CHANNEL_ID = "UCQ7MuRpjwD9XTwRfgnkpmBw";

/** Hero polaroid: 3 fotos que rotan cada 3s. */
export const TREE_HERO_POLAROIDS = [
  { src: "/media/capsules/polaroid.jpg", alt: "GAL'S Studio — sesión en el mat" },
  { src: "/media/capsules/pilates.jpg", alt: "GAL'S Studio — pilates" },
  { src: "/media/capsules/sculpt.jpg", alt: "GAL'S Studio — sculpt" },
] as const;

export type TreeLink = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  beweClass?: string;
};

/** Cards horizontales estilo Doctor Bello (imagen + copy + pastilla). */
export type TreeFeatureDualSection = {
  title: string;
  blurb: string;
  cta: string;
  href?: string;
  beweClass?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  secondaryExternal?: boolean;
};

export type TreeFeatureCard = {
  id: string;
  title: string;
  blurb: string;
  image: string;
  position?: string;
  fit?: "cover" | "contain";
  /** Foto vertical: panel más alto para no “aplastar” la escena */
  portrait?: boolean;
  /** Imagen de fondo de toda la cápsula (texto encima) */
  bgFill?: boolean;
  /** Fondo suave + foto inset clara (fusión split + bg) */
  merge?: boolean;
  /** Imagen arriba, solapada con la cápsula de texto (sin foto de fondo) */
  imageTop?: boolean;
  /** Dos bloques en una sola cápsula (ej. reservar + plan) */
  dual?: [TreeFeatureDualSection, TreeFeatureDualSection];
  cta: string;
  href?: string;
  external?: boolean;
  beweClass?: string;
  /** CTA secundario (outline), ej. App */
  secondaryCta?: string;
  secondaryHref?: string;
  secondaryExternal?: boolean;
};

export const TREE_FEATURE_CARDS: TreeFeatureCard[] = [
  {
    id: "eventos",
    title: "Eventos",
    blurb:
      "Experiencias, encuentros y fechas especiales para vivir GAL'S en comunidad.",
    image: "/media/community/eventos-gals.jpg",
    position: "object-[center_40%]",
    bgFill: true,
    cta: "Ver eventos",
    href: "/eventos",
  },
  {
    id: "clase-plan",
    title: "Reservar o unirte",
    blurb: "Clase suelta o plan — elige cómo quieres moverte.",
    image: "/media/community/welcome-popup.jpg",
    position: "object-[32%_58%]",
    bgFill: true,
    cta: "Reservar",
    dual: [
      {
        title: "Reservar clase",
        blurb:
          "Agenda tu clase en el studio o descarga la app si prefieres gestionar todo desde el celular.",
        cta: "Reservar",
        href: "/#horario",
        secondaryCta: "App",
        secondaryHref: APP_DOWNLOAD_URL,
        secondaryExternal: true,
      },
      {
        title: "Inscríbete a un plan",
        blurb:
          "Membresías y bonos para moverte con constancia. Elige el ritmo que va contigo.",
        cta: "Ver planes",
        beweClass: BEWE_SUBS_CLASS,
      },
    ],
  },
  {
    id: "reto",
    title: "Reto 7 días",
    blurb:
      "Pilates en casa para empezar a moverte con constancia, sin presión.",
    image: "/media/programa/reto-pilates-en-casa.png",
    position: "object-center",
    imageTop: true,
    cta: "Empezar reto",
    href: "/programa",
  },
  {
    id: "alimentacion",
    title: "Alimentación",
    blurb:
      "Guías y herramientas para nutrirte con la misma intención que en el mat.",
    image: "/media/alimentacion/guia-alimentacion.png",
    position: "object-center",
    imageTop: true,
    cta: "Ver más",
    href: "/alimentacion",
  },
];

export const TREE_FOOTER_LINKS: TreeLink[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: WHATSAPP_COMMUNITY_URL,
    external: true,
  },
  {
    id: "reservar",
    label: "Reservar",
    href: "/#horario",
  },
  {
    id: "app",
    label: "App",
    href: APP_DOWNLOAD_URL,
    external: true,
  },
  {
    id: "web",
    label: "Sitio web",
    href: "/",
  },
];

export const TREE_LOCATION = {
  name: "GAL'S Studio",
  area: "Chicó Reservado · Bogotá",
  address: ADDRESS,
  phone: PHONE_DISPLAY,
  phoneHref: `tel:+${WHATSAPP_NUMBER}`,
  hint: "Te esperamos en el mat",
  /** Calle 97 #10-28, Chicó Reservado (Cl 97 × Cr 10) */
  lat: 4.6818,
  lng: -74.0466,
  image: "/media/experiencias/wellness-experiences.jpg",
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
  /**
   * Embed anclado a la dirección (geocoding de Google) + zoom calle.
   */
  get mapEmbedUrl() {
    return `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=17&hl=es&t=m&output=embed`;
  },
  /** @deprecated alias */
  get osmEmbedUrl() {
    return this.mapEmbedUrl;
  },
};

export type TreeVideo = {
  id: string;
  title: string;
  thumb: string;
  href: string;
};

function treeYtThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

const FALLBACK_VIDEOS: TreeVideo[] = [
  "ogIRCJU8Jmc",
  "wOuwFgJzDvw",
  "-n7hyhNpHjE",
  "HbdDjltZuNo",
  "FEWyei-Rsmo",
  "Yru31rZiftY",
].map((id, i) => ({
  id,
  title: `Video GAL'S ${i + 1}`,
  thumb: treeYtThumb(id),
  href: ytWatch(id),
}));

export async function getLatestYoutubeVideos(
  limit = 8,
): Promise<TreeVideo[]> {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/atom+xml,application/xml,text/xml" },
    });
    if (!res.ok) return FALLBACK_VIDEOS.slice(0, limit);
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(
      0,
      limit,
    );
    const videos: TreeVideo[] = [];
    for (const [, entry] of entries) {
      const id = entry.match(
        /<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/,
      )?.[1];
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
      if (!id) continue;
      videos.push({
        id,
        title: title || "Video GAL'S",
        thumb: treeYtThumb(id),
        href: ytWatch(id),
      });
    }
    return videos.length ? videos : FALLBACK_VIDEOS.slice(0, limit);
  } catch {
    return FALLBACK_VIDEOS.slice(0, limit);
  }
}

// Re-export por compatibilidad
export { BEWE_BOOK_CLASS, INSTAGRAM };
