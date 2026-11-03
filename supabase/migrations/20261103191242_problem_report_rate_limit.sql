-- Guarda apenas a última tentativa por conta; o conteúdo é enviado por SMTP,
-- sem copiar relatos ou endereços de e-mail para uma tabela pública.
create table public.problem_report_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  attempted_at timestamptz not null
);
alter table public.problem_report_rate_limits enable row level security;
revoke all on public.problem_report_rate_limits from public, anon, authenticated;

-- SECURITY DEFINER é necessário para reservar sem conceder escrita direta na
-- tabela (o cliente não pode alterar o relógio). Identidade sempre de auth.uid().
create function public.reserve_problem_report()
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  account_id uuid := auth.uid();
  affected integer;
begin
  if account_id is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;
  insert into public.problem_report_rate_limits(user_id, attempted_at)
  values(account_id, clock_timestamp())
  on conflict(user_id) do update set attempted_at = excluded.attempted_at
  where problem_report_rate_limits.attempted_at <= clock_timestamp() - interval '1 minute';
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;
revoke all on function public.reserve_problem_report() from public, anon;
grant execute on function public.reserve_problem_report() to authenticated;
