-- Migración: email + flag de correo de confirmación en registrations
-- Correr en SQL Editor de Supabase (proyecto gals-eventos)

alter table public.registrations
  add column if not exists email text;

alter table public.registrations
  add column if not exists confirmation_email_sent_at timestamptz;
