create extension if not exists pgcrypto;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('life', 'food', 'travel')),
  title text not null,
  description text,
  image_url text not null,
  thumb_url text,
  taken_at date,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.photos enable row level security;

drop policy if exists "Public read published photos" on public.photos;
create policy "Public read published photos"
on public.photos
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Authenticated full access photos" on public.photos;
create policy "Authenticated full access photos"
on public.photos
for all
to authenticated
using (true)
with check (true);
