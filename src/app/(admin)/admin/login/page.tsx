"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    search.get("error") === "config"
      ? "Faltan ADMIN_USERNAME / ADMIN_PASSWORD en el entorno"
      : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión");
      }
      const next = search.get("next") || "/admin/eventos";
      router.replace(next.startsWith("/admin") ? next : "/admin/eventos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-gradient-to-b from-gals-blue-soft via-[#f3f5fb] to-gals-mist px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/70 bg-white/85 p-7 shadow-[0_16px_48px_rgba(85,104,148,0.12)] backdrop-blur-sm"
      >
        <p className="text-[10px] font-semibold tracking-[0.22em] text-gals-blue-deep uppercase">
          GAL&apos;S Studio
        </p>
        <h1 className="mt-1 font-display text-2xl tracking-tight text-gals-ink uppercase">
          Admin eventos
        </h1>
        <p className="mt-2 text-sm text-gals-muted">
          Entrá con tu usuario y contraseña.
        </p>

        <label className="mt-6 mb-1.5 block text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
          Usuario
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="w-full rounded-xl border border-gals-blue-deep/12 bg-white/90 px-3.5 py-2.5 text-sm text-gals-ink outline-none transition focus:border-gals-blue-deep/35 focus:ring-2 focus:ring-gals-blue-soft"
        />

        <label className="mt-4 mb-1.5 block text-[10px] font-semibold tracking-[0.16em] text-gals-muted uppercase">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-gals-blue-deep/12 bg-white/90 px-3.5 py-2.5 text-sm text-gals-ink outline-none transition focus:border-gals-blue-deep/35 focus:ring-2 focus:ring-gals-blue-soft"
        />

        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gals-blue-deep px-4 py-3 text-[11px] font-bold tracking-wide text-white uppercase disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center bg-gals-blue-soft text-sm text-gals-muted">
          Cargando…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
