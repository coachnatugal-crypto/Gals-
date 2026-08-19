import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "gals_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 días

function encoder() {
  return new TextEncoder();
}

function toBase64Url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD?.trim() ?? "";
  const secret =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "";
  return { username, password, secret };
}

export function isAdminAuthConfigured() {
  const { username, password, secret } = getAdminCredentials();
  return Boolean(username && password && secret);
}

export async function createAdminSessionToken(username: string) {
  const { secret } = getAdminCredentials();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET no configurado");
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `${username}|${exp}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder().encode(payload));
  return `${payload}.${toBase64Url(sig)}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) return false;
  const { username, secret } = getAdminCredentials();
  if (!username || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const [user, expRaw] = payload.split("|");
  const exp = Number(expRaw);
  if (!user || !Number.isFinite(exp) || exp < Date.now()) return false;
  if (user !== username) return false;

  try {
    const key = await hmacKey(secret);
    return crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sig),
      encoder().encode(payload),
    );
  } catch {
    return false;
  }
}

export function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function setAdminSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function readAdminSessionCookie(req: NextRequest) {
  return req.cookies.get(COOKIE)?.value;
}

export { COOKIE as ADMIN_SESSION_COOKIE };
