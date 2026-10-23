-- Preserva conteúdo compartilhado, removendo a ligação com a conta apagada.
-- Respostas precisam de chave própria: a antiga chave composta não aceitava autoria nula.
do $$
declare entry record;
begin
 for entry in select * from (values
  ('nucleus_agreement_participants','agreement_id'),
  ('nucleus_event_participants','event_id'),
  ('nucleus_habit_revision_responses','revision_id'),
  ('nucleus_habit_trial_responses','trial_id')
 ) as response_tables(table_name,parent_column) loop
  execute format('alter table public.%I drop constraint %I',entry.table_name,entry.table_name||'_pkey');
  execute format('alter table public.%I add column id uuid not null default gen_random_uuid() primary key',entry.table_name);
  -- Mantém os ON CONFLICT existentes e a unicidade para contas ainda associadas.
  execute format('alter table public.%I add unique (%I,user_id)',entry.table_name,entry.parent_column);
 end loop;
end;$$;

do $$
declare entry record;
begin
 for entry in select * from (values
  ('nuclei','created_by'),('nucleus_invitations','created_by'),
  ('nucleus_agreements','created_by'),('nucleus_agreement_participants','user_id'),
  ('nucleus_events','created_by'),('nucleus_event_participants','user_id'),
  ('nucleus_habit_moments','author_id'),('nucleus_habit_revisions','created_by'),
  ('nucleus_habit_revision_responses','user_id'),('nucleus_habit_trials','created_by'),
  ('nucleus_habit_trials','activated_by'),('nucleus_habit_trial_responses','user_id'),
  ('nucleus_admin_nominations','nominated_by')
 ) as history_columns(table_name,column_name) loop
  execute format('alter table public.%I drop constraint %I',entry.table_name,entry.table_name||'_'||entry.column_name||'_fkey');
  execute format('alter table public.%I alter column %I drop not null',entry.table_name,entry.column_name);
  execute format('alter table public.%I add constraint %I foreign key (%I) references auth.users(id) on delete set null',entry.table_name,entry.table_name||'_'||entry.column_name||'_fkey',entry.column_name);
 end loop;
end;$$;

create function public.delete_my_account(confirmation_phrase text)
returns void language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); target uuid;
begin
 if confirmation_phrase is distinct from 'APAGAR CONTA' then
  raise exception 'confirmation phrase does not match' using errcode='22023';
 end if;
 -- Bloqueia também novas referências à conta. Um JWT antigo não autoriza repetir a exclusão.
 perform 1 from auth.users where id=actor for update;
 if not found then raise exception 'not authorized' using errcode='42501'; end if;
 -- Storage exige remoção pela API de arquivos; excluir só metadados deixaria objetos órfãos.
 if exists(select 1 from storage.objects where owner_id=actor::text or owner=actor) then
  raise exception 'account owns storage objects' using errcode='55000';
 end if;

 -- Ordem determinística entre exclusões concorrentes; todas as saídas seguem o contrato vigente.
 for target in select n.id from public.nuclei n
  where exists(select 1 from public.nucleus_members m where m.nucleus_id=n.id and m.user_id=actor)
  order by n.id for update of n
 loop
  -- Outra saída pode ter removido o vínculo enquanto aguardávamos a trava.
  if exists(select 1 from public.nucleus_members where nucleus_id=target and user_id=actor) then
   perform public.depart_nucleus_member(target,actor);
  end if;
 end loop;

 -- A exclusão substitui inclusive autoria oculta de saídas anteriores por Conta excluída.
 update public.nucleus_habit_moments set authorship_hidden=false where author_id=actor;
 update public.nucleus_events set authorship_hidden=false where created_by=actor;
 update public.nucleus_event_participants set authorship_hidden=false where user_id=actor;
 update public.nucleus_invitations set revoked_at=coalesce(revoked_at,clock_timestamp()) where created_by=actor;
 delete from public.nucleus_admin_nominations where nominated_by=actor or user_id=actor;

 -- FK SET NULL conserva história; cascatas removem preferências, sessões, identidades e credenciais.
 -- Uma restrição (inclusive Storage) aborta toda a transação, sem saída parcial dos Núcleos.
 delete from auth.users where id=actor;
end;$$;
revoke all on function public.delete_my_account(text) from public,anon;
grant execute on function public.delete_my_account(text) to authenticated;

-- Esta leitura recebe código de convite sem exigir associação. Negar JWT de conta apagada.
create or replace function public.inspect_invitation(invitation_code text)
returns table(nucleus_id uuid,nucleus_name text,nucleus_type text,nucleus_purpose text)
language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from auth.users where id=auth.uid()) then raise exception 'not authorized' using errcode='42501'; end if;
 if invitation_code is null or invitation_code !~ '^[0-9a-f]{32}$' then raise exception 'authentication required or invalid code' using errcode='22023'; end if;
 return query select n.id,n.name,n.type,n.purpose from public.nucleus_invitations i join public.nuclei n on n.id=i.nucleus_id
 where i.code=invitation_code and i.revoked_at is null and i.expires_at>clock_timestamp() and n.closed_at is null;
end;$$;

-- Campos explícitos distinguem conta apagada de autoria ocultada por uma preferência de saída.
drop function public.get_nucleus_calendar(uuid,timestamptz,integer,integer);
create function public.get_nucleus_calendar(target_nucleus uuid,from_ends_at timestamptz,page_offset integer default 0,page_size integer default 51)
returns table(id uuid,title text,intention text,starts_at timestamptz,ends_at timestamptz,time_zone text,created_by uuid,can_manage boolean,nucleus_event_participants jsonb,creator_deleted boolean)
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not exists(select 1 from public.nucleus_members where nucleus_id=target_nucleus and user_id=auth.uid()) then raise exception 'not authorized' using errcode='42501'; end if;
 if from_ends_at is null or page_offset is null or page_offset<0 or page_size is null or page_size not between 1 and 100 then raise exception 'invalid pagination' using errcode='22023'; end if;
 return query select e.id,e.title,e.intention,e.starts_at,e.ends_at,e.time_zone,case when e.authorship_hidden then null::uuid else e.created_by end,
  coalesce(e.created_by=auth.uid(),false) or exists(select 1 from public.nucleus_members m where m.nucleus_id=target_nucleus and m.user_id=auth.uid() and m.role='admin'),
  coalesce((select jsonb_agg(jsonb_build_object('user_id',case when p.authorship_hidden then null::uuid else p.user_id end,'response',p.response,'is_own',coalesce(p.user_id=auth.uid(),false),'account_deleted',p.user_id is null) order by p.user_id,p.id) from public.nucleus_event_participants p where p.event_id=e.id),'[]'::jsonb),
  e.created_by is null
 from public.nucleus_events e where e.nucleus_id=target_nucleus and e.ends_at>=from_ends_at order by e.starts_at,e.id offset page_offset limit page_size;
end;$$;
revoke all on function public.get_nucleus_calendar(uuid,timestamptz,integer,integer) from public,anon;
grant execute on function public.get_nucleus_calendar(uuid,timestamptz,integer,integer) to authenticated;

notify pgrst,'reload schema';
