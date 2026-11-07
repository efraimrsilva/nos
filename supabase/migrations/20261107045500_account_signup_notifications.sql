-- Fila privada: o cadastro não depende da rede nem do provedor de e-mail.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

create table private.account_notifications (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  reserved_until timestamptz,
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  request_id bigint,
  check (attempts >= 0)
);
alter table private.account_notifications enable row level security;
revoke all on private.account_notifications from public, anon, authenticated, service_role;
create index account_notifications_pending on private.account_notifications(next_attempt_at)
  where sent_at is null and attempts < 5;

create function private.enqueue_account_notification()
returns trigger language plpgsql security definer set search_path = '' as $$
declare account_name text;
begin
  -- Metadados servem somente para apresentação, nunca para autorizar acesso.
  account_name := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''), 'Não informado');
  account_name := coalesce(nullif(btrim(left(regexp_replace(account_name, '[[:cntrl:]]', ' ', 'g'), 200)), ''), 'Não informado');
  if new.email is not null and new.email <> '' then
    insert into private.account_notifications(id, name, email) values(new.id, account_name, new.email);
  end if;
  return new;
exception when others then
  -- Preservar cadastro mesmo se a fila falhar; aviso operacional sem dados pessoais.
  raise warning 'account_notification_enqueue_failed [%]', sqlstate;
  return new;
end;
$$;
revoke all on function private.enqueue_account_notification() from public, anon, authenticated, service_role;
create trigger enqueue_account_notification after insert on auth.users
  for each row execute function private.enqueue_account_notification();

create function public.claim_account_notification(event_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare notification private.account_notifications;
begin
  select * into notification from private.account_notifications where id = event_id for update;
  if not found then return jsonb_build_object('state', 'missing'); end if;
  if notification.sent_at is not null then return jsonb_build_object('state', 'sent'); end if;
  if notification.reserved_until > now() then return jsonb_build_object('state', 'busy'); end if;
  -- Reserva maior que o limite do receptor/SMTP evita sobreposição entre instâncias.
  update private.account_notifications set reserved_until = now() + interval '10 minutes' where id = event_id;
  return jsonb_build_object('state', 'claimed', 'name', notification.name, 'email', notification.email);
end;
$$;
revoke all on function public.claim_account_notification(uuid) from public, anon, authenticated;
grant execute on function public.claim_account_notification(uuid) to service_role;

create function public.finish_account_notification(event_id uuid, delivered boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update private.account_notifications set
    sent_at = case when delivered then now() else null end,
    name = case when delivered then null else name end,
    email = case when delivered then null else email end,
    reserved_until = null
  where id = event_id and sent_at is null and reserved_until > now();
  return found;
end;
$$;
revoke all on function public.finish_account_notification(uuid,boolean) from public, anon, authenticated;
grant execute on function public.finish_account_notification(uuid,boolean) to service_role;

create function private.dispatch_account_notifications()
returns void language plpgsql security definer set search_path = '' as $$
declare
  target_url text;
  shared_secret text;
  notification private.account_notifications;
  queued_request bigint;
  request_timestamp text;
begin
  -- Remover dados de falhas antigas e confirmações; manter fila operacional limitada.
  delete from private.account_notifications where created_at < now() - interval '30 days';
  select decrypted_secret into target_url from vault.decrypted_secrets where name = 'account_notification_url';
  select decrypted_secret into shared_secret from vault.decrypted_secrets where name = 'account_notification_secret';
  if target_url is null or shared_secret is null or length(shared_secret) < 32 then return; end if;
  if target_url !~ '^https://[^/]+/api/account-notifications$'
    and target_url !~ '^http://(127\.0\.0\.1|localhost|host\.docker\.internal):[0-9]+/api/account-notifications$' then
    raise warning 'account_notification_invalid_url';
    return;
  end if;
  for notification in
    select * from private.account_notifications
    where sent_at is null and attempts < 5 and next_attempt_at <= now()
      and (reserved_until is null or reserved_until <= now())
    order by next_attempt_at limit 10 for update skip locked
  loop
    begin
      -- pg_net tem privilégios amplos por padrão em algumas instalações. Sua
      -- fila recebe apenas referência assinada; os dados são buscados pela RPC privada.
      request_timestamp := floor(extract(epoch from clock_timestamp()))::bigint::text;
      select net.http_post(url := target_url,
        body := '{}'::jsonb,
        headers := jsonb_build_object('Content-Type', 'application/json',
          'X-Notification-Id', notification.id::text, 'X-Notification-Timestamp', request_timestamp,
          'X-Notification-Signature', encode(extensions.hmac(notification.id::text || '.' || request_timestamp, shared_secret, 'sha256'), 'hex')),
        timeout_milliseconds := 60000) into queued_request;
      update private.account_notifications set attempts = attempts + 1,
        next_attempt_at = now() + interval '5 minutes', request_id = queued_request where id = notification.id;
    exception when others then
      update private.account_notifications set attempts = attempts + 1,
        next_attempt_at = now() + interval '5 minutes' where id = notification.id;
      raise warning 'account_notification_dispatch_failed [%]', sqlstate;
    end;
  end loop;
end;
$$;
revoke all on function private.dispatch_account_notifications() from public, anon, authenticated, service_role;
select cron.schedule('account-notifications', '* * * * *', 'select private.dispatch_account_notifications()');
