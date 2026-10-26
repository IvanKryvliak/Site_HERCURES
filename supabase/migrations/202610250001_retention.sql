-- Автоматичне видалення старих подій аналітики.
-- Строк 14 місяців має збігатися з DATA_RETENTION_MONTHS у src/data/config.js та з текстом політики.
create or replace function public.purge_old_analytics_events()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.analytics_events where created_at < now() - interval '14 months';
  delete from public.analytics_rate_limits where window_start < now() - interval '1 hour';
$$;

revoke all on function public.purge_old_analytics_events() from public, anon, authenticated;
grant execute on function public.purge_old_analytics_events() to service_role;

-- Щоденний запуск о 03:17 через pg_cron. Якщо розширення недоступне, міграція не падає:
-- увімкніть Database -> Extensions -> pg_cron і виконайте рядок cron.schedule нижче вручну.
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule('purge-analytics-events', '17 3 * * *', 'select public.purge_old_analytics_events()');
exception when others then
  raise notice 'pg_cron is not available (%). Enable it and run: select cron.schedule(''purge-analytics-events'', ''17 3 * * *'', ''select public.purge_old_analytics_events()'');', sqlerrm;
end $$;
