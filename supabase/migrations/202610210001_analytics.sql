-- Privacy-conscious event analytics for the HEARCURES static React/Vite website.
-- No contact details or IP address are written to this table.
create table if not exists public.analytics_admins (
  email text primary key check (email = lower(email))
);
alter table public.analytics_admins enable row level security;
revoke all on public.analytics_admins from anon, authenticated;

create or replace function public.is_analytics_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
    and exists (
      select 1 from public.analytics_admins a
      where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;
revoke all on function public.is_analytics_admin() from public, anon;
grant execute on function public.is_analytics_admin() to authenticated;

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('page_view', 'contact_click')),
  session_id text not null check (length(session_id) between 8 and 80),
  page_path text not null default '/',
  source text not null default 'Direct' check (source in ('Direct', 'Search', 'Instagram', 'Facebook', 'LinkedIn', 'Other')),
  device text not null default 'Desktop' check (device in ('Mobile', 'Tablet', 'Desktop')),
  channel text check (channel in ('viber', 'mail', 'tel', 'other')),
  created_at timestamptz not null default now(),
  constraint contact_events_have_channel check (event_type <> 'contact_click' or channel is not null)
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_created_at_idx on public.analytics_events (event_type, created_at desc);
create index if not exists analytics_events_session_created_at_idx on public.analytics_events (session_id, created_at desc);

alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;
grant select on public.analytics_events to authenticated;

drop policy if exists "Only authenticated administrators can read analytics" on public.analytics_events;
drop policy if exists "Only allowlisted administrators can read analytics" on public.analytics_events;
create policy "Only allowlisted administrators can read analytics"
  on public.analytics_events
  for select
  to authenticated
  using (public.is_analytics_admin());

create or replace function public.get_analytics_summary(p_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_days integer := least(greatest(coalesce(p_days, 30), 7), 90);
  v_today date := (now() at time zone 'Europe/Prague')::date;
  v_result jsonb;
begin
  if not public.is_analytics_admin() then
    raise exception 'Administrator access required';
  end if;

  select jsonb_build_object(
    'visits', (
      select count(*) from public.analytics_events e
      where e.event_type = 'page_view' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
    ),
    'uniqueVisitors', (
      select count(distinct e.session_id) from public.analytics_events e
      where e.event_type = 'page_view' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
    ),
    'contacts', (
      select count(*) from public.analytics_events e
      where e.event_type = 'contact_click' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
    ),
    'series', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', d.day::text,
        'visits', (select count(*) from public.analytics_events e where e.event_type = 'page_view' and e.created_at >= (d.day::timestamp at time zone 'Europe/Prague') and e.created_at < ((d.day + 1)::timestamp at time zone 'Europe/Prague')),
        'visitors', (select count(distinct e.session_id) from public.analytics_events e where e.event_type = 'page_view' and e.created_at >= (d.day::timestamp at time zone 'Europe/Prague') and e.created_at < ((d.day + 1)::timestamp at time zone 'Europe/Prague')),
        'contacts', (select count(*) from public.analytics_events e where e.event_type = 'contact_click' and e.created_at >= (d.day::timestamp at time zone 'Europe/Prague') and e.created_at < ((d.day + 1)::timestamp at time zone 'Europe/Prague'))
      ) order by d.day)
      from (select generate_series(v_today - (v_days - 1), v_today, interval '1 day')::date as day) d
    ), '[]'::jsonb),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object('name', s.source, 'value', round(s.cnt * 100.0 / nullif(s.total, 0))::integer) order by s.cnt desc)
      from (
        select e.source, count(*) as cnt, sum(count(*)) over () as total
        from public.analytics_events e
        where e.event_type = 'page_view' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
        group by e.source
      ) s
    ), '[]'::jsonb),
    'devices', coalesce((
      select jsonb_agg(jsonb_build_object('name', d.device, 'value', round(d.cnt * 100.0 / nullif(d.total, 0))::integer) order by d.cnt desc)
      from (
        select e.device, count(*) as cnt, sum(count(*)) over () as total
        from public.analytics_events e
        where e.event_type = 'page_view' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
        group by e.device
      ) d
    ), '[]'::jsonb),
    'channels', coalesce((
      select jsonb_agg(jsonb_build_object('name', c.name, 'value', round(c.cnt * 100.0 / nullif(c.total, 0))::integer) order by c.cnt desc)
      from (
        select case e.channel when 'viber' then 'Viber' when 'mail' then 'Эл. почта' when 'tel' then 'Телефон' else 'Другое' end as name,
          count(*) as cnt, sum(count(*)) over () as total
        from public.analytics_events e
        where e.event_type = 'contact_click' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
        group by 1
      ) c
    ), '[]'::jsonb),
    'topPages', coalesce((
      select jsonb_agg(jsonb_build_object('name', p.name, 'views', p.cnt, 'share', round(p.cnt * 100.0 / nullif(p.total, 0))::integer) order by p.cnt desc)
      from (
        select case e.page_path when '/' then 'Главная страница' else e.page_path end as name,
          count(*) as cnt, sum(count(*)) over () as total
        from public.analytics_events e
        where e.event_type = 'page_view' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
        group by 1
      ) p
    ), '[]'::jsonb),
    'latestClicks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', recent.id,
        'date', to_char(recent.created_at at time zone 'Europe/Prague', 'YYYY-MM-DD HH24:MI'),
        'channel', recent.channel,
        'source', recent.source,
        'page', case recent.page_path when '/' then 'Главная страница' else recent.page_path end
      ) order by recent.created_at desc)
      from (
        select e.id, e.created_at, e.channel, e.source, e.page_path
        from public.analytics_events e
        where e.event_type = 'contact_click' and e.created_at >= ((v_today - (v_days - 1))::timestamp at time zone 'Europe/Prague')
        order by e.created_at desc
        limit 20
      ) recent
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_analytics_summary(integer) from public, anon;
grant execute on function public.get_analytics_summary(integer) to authenticated;
