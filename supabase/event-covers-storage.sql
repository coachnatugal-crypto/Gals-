-- Bucket público para portadas de eventos.
-- La API /api/admin/eventos/upload también intenta crearlo con service role.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-covers',
  'event-covers',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Lectura pública de portadas
drop policy if exists "event covers public read" on storage.objects;
create policy "event covers public read"
on storage.objects for select
using (bucket_id = 'event-covers');
