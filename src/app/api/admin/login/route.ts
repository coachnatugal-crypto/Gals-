import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCredentials,
  isAdminAuthConfigured,
  setAdminSessionCookie,
  timingSafeEqualString,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin no configurado" },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";
  const creds = getAdminCredentials();

  const userOk = timingSafeEqualString(username, creds.username);
  const passOk = timingSafeEqualString(password, creds.password);

  if (!userOk || !passOk) {
    return NextResponse.json(
      { ok: false, error: "Usuario o contraseña incorrectos" },
      { status: 401 },
    );
  }

  const token = await createAdminSessionToken(creds.username);
  const res = NextResponse.json({ ok: true });
  setAdminSessionCookie(res, token);
  return res;
}
