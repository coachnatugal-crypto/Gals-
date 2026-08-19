"use client";

import { useMemo, useRef, useState } from "react";
import {
  EVENT_COVER_GROUPS,
  EVENT_COVER_PRESETS,
} from "@/lib/event-cover-presets";

type Props = {
  value: string;
  onChange: (src: string) => void;
  labelClass: string;
  inputClass: string;
};

export function EventCoverPicker({
  value,
  onChange,
  labelClass,
  inputClass,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [group, setGroup] = useState<(typeof EVENT_COVER_GROUPS)[number] | "Todas">(
    "Todas",
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = useMemo(() => {
    if (group === "Todas") return EVENT_COVER_PRESETS;
    return EVENT_COVER_PRESETS.filter((p) => p.group === group);
  }, [group]);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/eventos/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error || "Error al subir");
      }
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="md:col-span-2 space-y-3">
      <label className={labelClass}>Portada del evento</label>

      <div className="overflow-hidden rounded-2xl border border-gals-blue-deep/12 bg-gals-blue-soft/40">
        <div className="relative aspect-[16/9] bg-gals-ink/5 sm:aspect-[21/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value || "/media/capsules/pilates.jpg"}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gals-ink/70 to-transparent px-4 py-3">
            <p className="truncate text-xs font-medium text-white/90">
              {value || "Sin portada"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-gals-blue-deep px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {uploading ? "Subiendo…" : "Subir imagen"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <p className="text-xs text-gals-muted">JPG, PNG o WEBP · máx. 8 MB</p>
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setGroup("Todas")}
          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
            group === "Todas"
              ? "bg-gals-blue-deep text-white"
              : "bg-white text-gals-blue-deep ring-1 ring-gals-blue-deep/15"
          }`}
        >
          Todas
        </button>
        {EVENT_COVER_GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              group === g
                ? "bg-gals-blue-deep text-white"
                : "bg-white text-gals-blue-deep ring-1 ring-gals-blue-deep/15"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid max-h-[280px] grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-gals-blue-deep/10 bg-white/70 p-2 sm:grid-cols-4 md:grid-cols-5">
        {presets.map((p) => {
          const selected = value === p.src;
          return (
            <button
              key={p.src}
              type="button"
              title={p.label}
              onClick={() => onChange(p.src)}
              className={`group relative overflow-hidden rounded-xl border-2 text-left transition ${
                selected
                  ? "border-gals-blue-deep shadow-md"
                  : "border-transparent hover:border-gals-blue/40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gals-ink/65 px-1.5 py-1 text-[9px] font-medium text-white truncate">
                {p.label}
              </span>
              {selected ? (
                <span className="absolute top-1.5 right-1.5 rounded-full bg-gals-blue-deep px-1.5 py-0.5 text-[8px] font-bold text-white uppercase">
                  OK
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div>
        <label className={labelClass}>Path / URL (avanzado)</label>
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/media/eventos/…"
        />
      </div>
    </div>
  );
}
