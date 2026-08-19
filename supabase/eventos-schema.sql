-- GAL'S · gals-eventos
-- Pegar en: Supabase → SQL Editor → New query → Run
-- Solo landing /eventos + admin (Bewe no usa esto)

create extension if not exists "pgcrypto";

-- ─── Eventos ───────────────────────────────────────────────
create table if not exists public.events (
  id text primary key,
  kind text not null check (kind in ('free', 'paid')),
  featured boolean not null default false,
  published boolean not null default true,
  title text not null,
  eyebrow text not null default '',
  date_label text not null default '',
  time_label text,
  place text not null default '',
  headline text not null default '',
  subhead text not null default '',
  concept text,
  signup_pitch text,
  image text not null default '/media/capsules/pilates.jpg',
  starts_at timestamptz not null,
  price text,
  price_amount integer check (price_amount is null or price_amount > 0),
  show_price boolean not null default true,
  cta text not null default 'Reservar mi cupo',
  bewe_after text not null default 'form' check (bewe_after in ('form', 'packs')),
  why jsonb not null default '[]'::jsonb,
  stats jsonb,
  after_event jsonb,
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_published_idx on public.events (published);

-- ─── Registros (leads / cupos) ────────────────────────────
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references public.events (id) on delete restrict,
  name text not null,
  whatsapp text not null,
  email text,
  source text not null default 'eventos',
  status text not null default 'nuevo'
    check (status in ('nuevo', 'pendiente_pago', 'pagado', 'confirmado', 'cancelado')),
  notes text,
  confirmation_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists registrations_event_id_idx on public.registrations (event_id);
create index if not exists registrations_status_idx on public.registrations (status);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

-- ─── Pagos Mercado Pago ───────────────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations (id) on delete cascade,
  event_id text not null references public.events (id) on delete restrict,
  preference_id text,
  payment_id text,
  external_reference text,
  amount integer not null check (amount > 0),
  currency text not null default 'COP',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'in_process')),
  mp_status_detail text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists payments_preference_id_uidx
  on public.payments (preference_id)
  where preference_id is not null;

create unique index if not exists payments_payment_id_uidx
  on public.payments (payment_id)
  where payment_id is not null;

create index if not exists payments_registration_id_idx on public.payments (registration_id);
create index if not exists payments_event_id_idx on public.payments (event_id);
create index if not exists payments_status_idx on public.payments (status);

-- ─── updated_at automático ────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at
  before update on public.registrations
  for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ─── RLS ──────────────────────────────────────────────────
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;

-- Lectura pública solo de eventos publicados (landing)
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read"
  on public.events
  for select
  to anon, authenticated
  using (published = true);

-- Escrituras / admin / webhook: solo service_role (bypass RLS)
-- No creamos policies de insert/update para anon a propósito.

-- ─── Seed inicial (agenda PDF ago–sep 2026) ───────────────
insert into public.events (
  id, kind, featured, published, title, eyebrow, date_label, time_label, place,
  headline, subhead, concept, signup_pitch, image, starts_at,
  price, price_amount, show_price, cta, bewe_after, why
) values
(
  'clase-clientas-sep',
  'free', false, true,
  'Clase con clientas',
  'Solo clientas',
  '5 de septiembre',
  '8:30AM',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Empezamos el día juntas',
  'Un espacio especial para nuestras clientas, con intención',
  'Un espacio especial para nuestras clientas: nos movemos juntas para empezar el día con intención.',
  'Si ya eres GAL''S, este cupo es para ti. Déjanos tus datos y te confirmamos el lugar.',
  '/media/capsules/pilates.jpg',
  '2026-09-05T08:30:00-05:00',
  'Incluido en tu plan', null, true,
  'Reservar mi cupo', 'form',
  '[{"emoji":"🧘","label":"Movimiento en comunidad"},{"emoji":"☀️","label":"8:30 am"},{"emoji":"🩶","label":"Solo clientas"},{"emoji":"👯","label":"Empezar el día juntas"}]'::jsonb
),
(
  'pilates-yin-yoga-ago',
  'paid', true, true,
  'Pilates & Yin Yoga',
  'Experiencia · 60 min',
  '22 de agosto',
  'Sábado',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Mueve el cuerpo y encuentra tu paz',
  'Una práctica suave para calmarte y conectar con la vibración del amor',
  'Mueve el cuerpo y encuentra tu paz interna. Una práctica suave para calmarte y conectar con la vibración del amor.',
  '60 minutos para bajar revoluciones. Público $60.000 · clientas: incluido en tu plan.',
  '/media/capsules/yin-yoga.jpg',
  '2026-08-22T10:00:00-05:00',
  '$60.000', 60000, true,
  'Pagar y reservar', 'packs',
  '[{"emoji":"🧘","label":"Pilates + Yin"},{"emoji":"🕊️","label":"Calma y conexión"},{"emoji":"⏱️","label":"60 min"},{"emoji":"🩶","label":"Clientas: en tu plan"}]'::jsonb
),
(
  'pilates-color-lab-ago',
  'paid', false, true,
  'Pilates & Color Lab',
  'Experiencia sensorial',
  '28 de agosto',
  'Viernes',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Movimiento y color se encuentran',
  'Pilates envuelto en una experiencia sensorial donde cada tono guía tu práctica',
  'Movimiento y color se encuentran. Pilates envuelto en una experiencia sensorial.',
  'Una noche distinta: pilates + color. Déjanos tus datos y te llevamos al pago.',
  '/media/capsules/_DSC4460.jpg',
  '2026-08-28T18:00:00-05:00',
  'Por confirmar', null, true,
  'Reservar mi cupo', 'packs',
  '[{"emoji":"🎨","label":"Color Lab"},{"emoji":"🔥","label":"Pilates"},{"emoji":"✨","label":"Experiencia sensorial"},{"emoji":"👯","label":"Comunidad"}]'::jsonb
),
(
  'cycle-power-ago',
  'paid', false, true,
  'Cycle & Power',
  'Cardio + fuerza',
  '29 de agosto',
  'Sábado',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Sube el ritmo',
  'Cardio sobre la bici y trabajo de fuerza para encender tu potencia',
  'Sube el ritmo. Cardio sobre la bici y trabajo de fuerza.',
  'Si quieres sudar y salir con el corazón a mil, este es tu sábado.',
  '/media/capsules/sculpt.jpg',
  '2026-08-29T10:00:00-05:00',
  'Por confirmar', null, true,
  'Reservar mi cupo', 'packs',
  '[{"emoji":"🚴","label":"Cycle"},{"emoji":"💪","label":"Fuerza"},{"emoji":"🔥","label":"Cardio"},{"emoji":"🩶","label":"Potencia"}]'::jsonb
),
(
  'luz-interior-velas',
  'paid', false, true,
  'Luz Interior · Pilates & Velas',
  'Práctica íntima',
  '5 de septiembre',
  '10:30AM',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Pilates a la luz de las velas',
  'Bajamos el ritmo, encendemos la calma y cerramos en calidez',
  'Pilates a la luz de las velas. Bajamos el ritmo y encendemos la calma.',
  'Una mañana íntima para volver a ti.',
  '/media/experiencias/wellness-experiences.jpg',
  '2026-09-05T10:30:00-05:00',
  'Por confirmar', null, true,
  'Reservar mi cupo', 'packs',
  '[{"emoji":"🕯️","label":"Velas"},{"emoji":"🧘","label":"Pilates"},{"emoji":"🌙","label":"Calma"},{"emoji":"🩶","label":"Espacio íntimo"}]'::jsonb
),
(
  'taller-anaka',
  'paid', false, true,
  'Taller con Anaka',
  'Taller especial',
  '12 de septiembre',
  'Sábado',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Cuerpo, respiración y presencia',
  'Encuentro guiado por Anaka · cupos limitados',
  'Un encuentro guiado por Anaka para profundizar en cuerpo, respiración y presencia.',
  'Cupos limitados. Déjanos tus datos y te confirmamos pago y lugar.',
  '/media/capsules/experiencias-gals.jpg',
  '2026-09-12T10:00:00-05:00',
  'Por confirmar', null, true,
  'Reservar mi cupo', 'packs',
  '[{"emoji":"🌬️","label":"Respiración"},{"emoji":"🧘","label":"Presencia"},{"emoji":"✨","label":"Invitada Anaka"},{"emoji":"🎟️","label":"Cupos limitados"}]'::jsonb
),
(
  'blue-paty-amor-amistad',
  'paid', false, true,
  'Blue Paty · Amor y Amistad',
  'Celebración',
  '19 de septiembre',
  'Sábado',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Celebramos en clave azul',
  'Trae a tu persona favorita y reconecten juntas',
  'Celebramos el amor y la amistad en clave azul.',
  'Trae a tu persona favorita. Reserva tu cupo y te confirmamos detalles de pago.',
  '/media/eventos/blue-pilates-party.jpg',
  '2026-09-19T10:00:00-05:00',
  'Por confirmar', null, true,
  'Reservar mi cupo', 'packs',
  '[{"emoji":"💙","label":"Dress code azul"},{"emoji":"👯","label":"Amor y amistad"},{"emoji":"🎉","label":"Celebración"},{"emoji":"🩶","label":"Comunidad GAL''S"}]'::jsonb
),
(
  'bowl-balance-sep',
  'paid', false, true,
  'Bowl & Balance',
  'Miembros Gals + público',
  '26 de septiembre',
  'Sábado',
  'GAL''S Studio · Calle 97 #10-28, Chicó Reservado, Bogotá',
  'Movernos y nutrirnos en comunidad',
  'Pilates, arma tu bowl y descubre lo nuevo de la tienda',
  'Una mañana para movernos y nutrirnos en comunidad.',
  'Público $99.000 · Gals $40.000. El pago online es tarifa público.',
  '/media/alimentacion/nati-bowl.png',
  '2026-09-26T10:00:00-05:00',
  '$99.000', 99000, true,
  'Pagar y reservar', 'packs',
  '[{"emoji":"🧘","label":"Clase de pilates"},{"emoji":"🥗","label":"Arma tu bowl"},{"emoji":"🛍️","label":"Tienda GAL''S"},{"emoji":"👯","label":"Comunidad"}]'::jsonb
)
on conflict (id) do nothing;
