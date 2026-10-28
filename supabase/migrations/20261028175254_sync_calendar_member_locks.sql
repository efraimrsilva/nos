-- A migração de administração substituía "begin\n" nas definições existentes.
-- Em checkouts Windows com CRLF, a substituição não ocorria na agenda.
-- Normaliza somente a definição de trabalho e acrescenta o bloqueio quando ausente.
-- Não modifica tabelas, dados, assinaturas, retornos ou permissões.
do $migration$
declare
  signature regprocedure;
  definition text;
  member_lock text;
begin
  for signature in
    select unnest(array[
      'public.create_nucleus_event(uuid,text,text,timestamptz,timestamptz,text)'::regprocedure,
      'public.update_nucleus_event(uuid,text,text,timestamptz,timestamptz,text)'::regprocedure,
      'public.delete_nucleus_event(uuid)'::regprocedure,
      'public.respond_nucleus_event(uuid,text)'::regprocedure
    ])
  loop
    definition := replace(pg_get_functiondef(signature), E'\r\n', E'\n');
    if position('perform public.lock_nucleus_member(' in definition) = 0 then
      member_lock := case
        when signature = 'public.create_nucleus_event(uuid,text,text,timestamptz,timestamptz,text)'::regprocedure
        then '  perform public.lock_nucleus_member(target_nucleus);'
        else '  perform public.lock_nucleus_member((select e.nucleus_id from public.nucleus_events e where e.id=target_event));'
      end;
      definition := replace(definition, E'begin\n', E'begin\n' || member_lock || E'\n');
      if position(member_lock in definition) = 0 then
        raise exception 'Não foi possível inserir o bloqueio de associação em %', signature;
      end if;
      execute definition;
    end if;
  end loop;
end;
$migration$;
