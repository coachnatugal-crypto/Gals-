import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/constants";

type Body = {
  email?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Guarda leads de correo.
 * - Si hay FORMSPREE_ENDPOINT en env, reenvía ahí.
 * - Si no, usa FormSubmit hacia el EMAIL del studio (confirmar 1 vez por correo).
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Correo inválido" },
      { status: 400 },
    );
  }

  const formspree = process.env.FORMSPREE_ENDPOINT?.trim();
  const endpoint =
    formspree || `https://formsubmit.co/ajax/${encodeURIComponent(EMAIL)}`;

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        _subject: "Nuevo lead GAL'S Studio",
        message: `Nuevo correo desde la landing: ${email}`,
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      console.error("[subscribe] upstream failed", upstream.status, text);
      return NextResponse.json(
        { ok: false, error: "No se pudo enviar" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[subscribe]", error);
    return NextResponse.json(
      { ok: false, error: "Error de red" },
      { status: 500 },
    );
  }
}
