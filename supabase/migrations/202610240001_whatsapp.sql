-- Канал зв'язку Viber замінено на WhatsApp.
-- 1) Старі події viber (якщо були, наприклад тестові) перейменовуються на whatsapp.
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.analytics_events'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) like '%viber%'
  loop
    execute format('alter table public.analytics_events drop constraint %I', c.conname);
  end loop;
end $$;

update public.analytics_events set channel = 'whatsapp' where channel = 'viber';

alter table public.analytics_events
  add constraint analytics_events_channel_check check (channel in ('whatsapp', 'mail', 'tel', 'other'));

-- 2) Функція статистики з новою назвою каналу.
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
        select case e.channel when 'whatsapp' then 'WhatsApp' when 'mail' then 'Эл. почта' when 'tel' then 'Телефон' else 'Другое' end as name,
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
