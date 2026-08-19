-- Fix permisos · gals-eventos
-- Pegar en Supabase → SQL Editor → Run
-- Corrige: permission denied for table events

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.events to anon, authenticated;
grant all on table public.events to service_role;

grant select, insert, update, delete on table public.registrations to service_role;
grant select on table public.registrations to anon, authenticated;

grant all on table public.payments to service_role;

-- Por si RLS bloquea lecturas admin vía service_role (no debería, pero refuerza)
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;

-- Lectura pública solo publicados (landing)
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read"
  on public.events
  for select
  to anon, authenticated
  using (published = true);
