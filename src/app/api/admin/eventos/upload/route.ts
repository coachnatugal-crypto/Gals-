import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  createSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

const BUCKET = "event-covers";
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeExt(file: File) {
  const fromName = path.extname(file.name).toLowerCase().replace(/^\./, "");
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  if (file.type.includes("gif")) return "gif";
  return "jpg";
}

function fileName(file: File) {
  const ext = safeExt(file);
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `cover-${stamp}-${rand}.${ext}`;
}

async function uploadToSupabase(bytes: Buffer, name: string, contentType: string) {
  const supabase = createSupabaseAdmin();

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
      allowedMimeTypes: [...ALLOWED],
    });
    if (createError && !/already exists/i.test(createError.message)) {
      throw createError;
    }
  }

  const { error } = await supabase.storage.from(BUCKET).upload(name, bytes, {
    contentType,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
  return data.publicUrl;
}

async function uploadLocal(bytes: Buffer, name: string) {
  const dir = path.join(process.cwd(), "public", "media", "eventos", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/media/eventos/uploads/${name}`;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Falta el archivo" },
        { status: 400 },
      );
    }

    if (!ALLOWED.has(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Solo imágenes (JPG, PNG, WEBP)" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Máximo 8 MB" },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const name = fileName(file);
    const contentType = file.type || "image/jpeg";

    let url: string | null = null;
    let via: "supabase" | "local" = "local";

    if (isSupabaseConfigured()) {
      try {
        url = await uploadToSupabase(bytes, name, contentType);
        via = "supabase";
      } catch (err) {
        console.error("[admin/eventos/upload] supabase", err);
      }
    }

    if (!url) {
      url = await uploadLocal(bytes, name);
      via = "local";
    }

    return NextResponse.json({ ok: true, url, via });
  } catch (error) {
    console.error("[admin/eventos/upload]", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo subir la imagen" },
      { status: 500 },
    );
  }
}
