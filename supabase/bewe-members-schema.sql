-- GAL'S · miembros Bewe (pestaña Comunidad)
-- Pegar en: Supabase → SQL Editor → Run
-- Si la tabla ya existe, corré también el bloque ALTER al final.

create table if not exists public.bewe_members (
  id text primary key,
  email text not null,
  name text not null default '',
  phone text,
  plan text not null default 'unknown'
    check (plan in ('transformacion', 'ilimitada', 'unknown')),
  plan_source text not null default 'none'
    check (plan_source in ('ticket', 'group', 'subscription', 'manual', 'none')),
  plan_label text,
  wa_tier text check (wa_tier is null or wa_tier in ('plus', 'vip')),
  email_sent_at timestamptz,
  subscribed_at timestamptz,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bewe_members_email_uidx
  on public.bewe_members (lower(email));

create index if not exists bewe_members_plan_idx
  on public.bewe_members (plan);

alter table public.bewe_members enable row level security;

grant select, insert, update, delete on public.bewe_members to service_role;

-- Migración si la tabla ya existía sin 'subscription':
do $$
begin
  alter table public.bewe_members drop constraint if exists bewe_members_plan_source_check;
  alter table public.bewe_members
    add constraint bewe_members_plan_source_check
    check (plan_source in ('ticket', 'group', 'subscription', 'manual', 'none'));
exception
  when others then
    raise notice 'plan_source constraint: %', SQLERRM;
end $$;

-- Fecha de suscripción (CSV Suscripciones / ticket Bewe)
alter table public.bewe_members
  add column if not exists subscribed_at timestamptz;
