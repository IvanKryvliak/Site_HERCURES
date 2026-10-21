-- Захист публічної функції track-event від накрутки та спаму.
-- IP-адреса не зберігається: лише денний хеш (SHA-256 з сіллю), який видаляється через годину.
create table if not exists public.analytics_rate_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (ip_hash, window_start)
);
alter table public.analytics_rate_limits enable row level security;
revoke all on public.analytics_rate_limits from anon, authenticated;

create or replace function public.analytics_allow_event(
  p_ip_hash text,
  p_session_id text,
  p_ip_limit integer default 60,
  p_session_limit integer default 20
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz := date_trunc('minute', now());
  v_hits integer;
  v_session_hits integer;
begin
  -- Час від часу чистимо старі записи.
  if random() < 0.05 then
    delete from public.analytics_rate_limits where window_start < now() - interval '1 hour';
  end if;

  insert into public.analytics_rate_limits as r (ip_hash, window_start, hits)
  values (p_ip_hash, v_window, 1)
  on conflict (ip_hash, window_start) do update set hits = r.hits + 1
  returning r.hits into v_hits;

  if v_hits > p_ip_limit then
    return false;
  end if;

  select count(*) into v_session_hits
  from public.analytics_events
  where session_id = p_session_id and created_at > now() - interval '1 minute';

  return v_session_hits < p_session_limit;
end;
$$;

revoke all on function public.analytics_allow_event(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.analytics_allow_event(text, text, integer, integer) to service_role;
