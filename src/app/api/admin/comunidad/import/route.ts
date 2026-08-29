import { NextResponse } from "next/server";
import { importBeweMembersFromCsv } from "@/lib/bewe-members";
import { isSupabaseConfigured } from "@/lib/supabase/server";

function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function detectDelimiter(headerLine: string): "," | ";" | "\t" {
  let commas = 0;
  let semis = 0;
  let tabs = 0;
  let inQuotes = false;
  for (let i = 0; i < headerLine.length; i += 1) {
    const ch = headerLine[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (inQuotes) continue;
    if (ch === ",") commas += 1;
    if (ch === ";") semis += 1;
    if (ch === "\t") tabs += 1;
  }
  if (tabs >= commas && tabs >= semis && tabs > 0) return "\t";
  if (semis > commas) return ";";
  return ",";
}

function normalizeHeader(h: string) {
  return h
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Exact match first, then includes only for aliases of length >= 5. */
function pickCol(headers: string[], aliases: string[]): number {
  for (const alias of aliases) {
    const exact = headers.findIndex((h) => h === alias);
    if (exact >= 0) return exact;
  }
  for (const alias of aliases) {
    if (alias.length < 5) continue;
    const soft = headers.findIndex((h) => h.includes(alias));
    if (soft >= 0) return soft;
  }
  return -1;
}

function isActiveStatus(raw: string): boolean {
  const t = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
  if (!t) return true;
  if (
    /cancel|inactiv|vencid|expir|pausad|baja|terminad|finaliz|no\s*activ/.test(
      t,
    )
  ) {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase no configurado" },
      { status: 503 },
    );
  }

  let text = "";
  const contentType = request.headers.get("content-type") || "";
  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json(
          { ok: false, error: "Subí un archivo CSV" },
          { status: 400 },
        );
      }
      text = await file.text();
    } else {
      const body = (await request.json()) as { csv?: string };
      text = String(body.csv ?? "");
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "No se pudo leer el CSV" },
      { status: 400 },
    );
  }

  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return NextResponse.json(
      { ok: false, error: "El CSV está vacío o sin encabezados" },
      { status: 400 },
    );
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitCsvLine(lines[0], delimiter).map(normalizeHeader);

  const emailIdx = pickCol(headers, [
    "email",
    "correo",
    "mail",
    "correoelectronico",
    "emailcliente",
  ]);
  const nameIdx = pickCol(headers, [
    "nombre",
    "name",
    "fullname",
    "cliente",
    "usuario",
    "miembro",
    "nombremiembro",
  ]);
  const lastIdx = pickCol(headers, ["apellido", "lastname", "last"]);
  const phoneIdx = pickCol(headers, [
    "telefono",
    "phone",
    "celular",
    "whatsapp",
    "mobile",
  ]);
  const planIdx = pickCol(headers, [
    "suscripcion",
    "subscription",
    "tipodesuscripcion",
    "tipodeplan",
    "membresia",
    "membership",
    "bonoactivo",
    "bono",
    "producto",
    "product",
    "paquete",
    "pack",
    "servicio",
    "nombreservicio",
    "nombreproducto",
    "nombredelplan",
    "plan",
  ]);
  const statusIdx = pickCol(headers, [
    "estado",
    "status",
    "activo",
    "active",
    "estadodesuscripcion",
  ]);
  const dateIdx = pickCol(headers, [
    "fechainicio",
    "fechainiciodesuscripcion",
    "inicio",
    "startdate",
    "startedat",
    "fechadesuscripcion",
    "fechadesuscripcion",
    "fechacreacion",
    "createdat",
    "created",
    "fechaalta",
    "fechadealta",
    "fecha",
    "date",
  ]);

  if (emailIdx < 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No encontré columna de email. El export debe tener email / correo (Suscripciones o clientes Bewe).",
      },
      { status: 400 },
    );
  }

  const rows = lines.slice(1).map((line) => {
    const cols = splitCsvLine(line, delimiter);
    const first = nameIdx >= 0 ? cols[nameIdx] || "" : "";
    const last = lastIdx >= 0 ? cols[lastIdx] || "" : "";
    const name = [first, last].filter(Boolean).join(" ").trim();
    const planText = planIdx >= 0 ? cols[planIdx] || null : null;
    const statusRaw = statusIdx >= 0 ? cols[statusIdx] || "" : "";
    const subscribedAt = dateIdx >= 0 ? cols[dateIdx] || null : null;
    return {
      email: cols[emailIdx] || "",
      name,
      phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null,
      planText,
      active: isActiveStatus(statusRaw),
      subscribedAt,
    };
  });

  try {
    const result = await importBeweMembersFromCsv(rows);
    return NextResponse.json({
      ok: true,
      ...result,
      detectedPlanColumn: planIdx >= 0,
      detectedDateColumn: dateIdx >= 0,
      delimiter,
      totalRows: rows.length,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al importar CSV";
    console.error("[admin/comunidad/import]", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
