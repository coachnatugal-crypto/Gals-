/**
 * Cliente mínimo Bewe Public API.
 * Docs: https://bewe-api.readme.io/reference/intro
 * Auth: Bearer token (Settings → Token en Bewe).
 */

const BEWE_BASE = "https://api.bewe.io";

export type BeweClient = {
  _id: string;
  name?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  groups?: unknown[];
  [key: string]: unknown;
};

export type BeweTicketItem = {
  name?: string;
  type?: string;
  total?: number;
};

export type BeweTicket = {
  _id: string;
  type?: string;
  date?: string;
  idClient?: string;
  items?: BeweTicketItem[];
  [key: string]: unknown;
};

type Paginated<T> = {
  pagination?: { total?: number; pages?: number; currentPage?: number };
  clients?: T[];
  tickets?: T[];
};

function getToken() {
  const token =
    process.env.BEWE_API_TOKEN?.trim() || process.env.BEWE_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Falta BEWE_API_TOKEN en .env.local (Bewe → Tu negocio → Token)",
    );
  }
  return token;
}

async function beweFetch<T>(
  path: string,
  searchParams?: Record<string, string>,
): Promise<T> {
  const url = new URL(path, BEWE_BASE);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v) url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Bewe ${res.status} ${path}${body ? `: ${body.slice(0, 200)}` : ""}`,
    );
  }

  return (await res.json()) as T;
}

/** Trae todas las páginas de clientes. */
export async function fetchAllBeweClients(): Promise<BeweClient[]> {
  const all: BeweClient[] = [];
  let page = 1;
  let pages = 1;

  while (page <= pages && page <= 100) {
    const data = await beweFetch<Paginated<BeweClient>>("/v1/clients", {
      page: String(page),
    });
    const batch = data.clients ?? [];
    all.push(...batch);
    pages = Math.max(1, data.pagination?.pages ?? 1);
    if (batch.length === 0) break;
    page += 1;
  }

  return all;
}

/** Trae tickets (compras) en un rango de fechas. */
export async function fetchBeweTickets(input?: {
  startDate?: string;
  endDate?: string;
}): Promise<BeweTicket[]> {
  const all: BeweTicket[] = [];
  let page = 1;
  let pages = 1;

  const startDate =
    input?.startDate ??
    new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const endDate = input?.endDate ?? new Date().toISOString().slice(0, 10);

  while (page <= pages && page <= 200) {
    const data = await beweFetch<Paginated<BeweTicket>>("/v1/tickets/", {
      page: String(page),
      startDate,
      endDate,
    });
    const batch = data.tickets ?? [];
    all.push(...batch);
    pages = Math.max(1, data.pagination?.pages ?? 1);
    if (batch.length === 0) break;
    page += 1;
  }

  return all;
}

export function isBeweConfigured() {
  return Boolean(
    process.env.BEWE_API_TOKEN?.trim() || process.env.BEWE_TOKEN?.trim(),
  );
}

/** Alias por compatibilidad. */
export function isBeweApiReady() {
  return isBeweConfigured();
}
