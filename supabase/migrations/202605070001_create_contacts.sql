create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  business text,
  stage text,
  team_size text,
  task text,
  tried text,
  deadline text,
  comment text,
  source_page text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists contacts_status_idx on public.contacts (status);
