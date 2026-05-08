alter table public.contacts
  add column if not exists priority text not null default 'normal',
  add column if not exists assigned_to text,
  add column if not exists crm_note text,
  add column if not exists status_changed_at timestamptz not null default now(),
  add column if not exists last_contacted_at timestamptz,
  add column if not exists next_contact_at timestamptz,
  add column if not exists closed_at timestamptz,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contacts_status_check'
      and conrelid = 'public.contacts'::regclass
  ) then
    alter table public.contacts
      add constraint contacts_status_check
      check (status in ('new', 'in_progress', 'waiting', 'closed', 'rejected'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contacts_priority_check'
      and conrelid = 'public.contacts'::regclass
  ) then
    alter table public.contacts
      add constraint contacts_priority_check
      check (priority in ('low', 'normal', 'high', 'urgent'));
  end if;
end $$;

create table if not exists public.contact_events (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  event_type text not null,
  from_status text,
  to_status text,
  note text,
  created_by text,
  created_at timestamptz not null default now()
);

alter table public.contact_events enable row level security;

create index if not exists contacts_priority_idx on public.contacts (priority);
create index if not exists contacts_next_contact_at_idx on public.contacts (next_contact_at);
create index if not exists contact_events_contact_id_idx on public.contact_events (contact_id);
create index if not exists contact_events_created_at_idx on public.contact_events (created_at desc);

create or replace function public.set_contacts_crm_timestamps()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status is distinct from old.status then
    new.status_changed_at = now();

    if new.status in ('closed', 'rejected') then
      new.closed_at = now();
    else
      new.closed_at = null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists contacts_crm_timestamps on public.contacts;

create trigger contacts_crm_timestamps
before update on public.contacts
for each row
execute function public.set_contacts_crm_timestamps();
