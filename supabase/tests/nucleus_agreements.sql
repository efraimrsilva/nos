begin;

select plan(1);

-- Dados locais descartados no fim do teste; cada identidade representa um papel distinto.
insert into auth.users(id) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc');
insert into public.nuclei(id, type, name, purpose, created_by) values
  ('11111111-1111-4111-8111-111111111111', 'casal', 'Teste A', 'Validação local', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('22222222-2222-4222-8222-222222222222', 'casal', 'Teste B', 'Isolamento local', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc');
insert into public.nucleus_members(nucleus_id, user_id, role) values
  ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'creator'),
  ('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'member'),
  ('22222222-2222-4222-8222-222222222222', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'creator');

set local role authenticated;

do $$
declare
  actor_a constant text := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  actor_b constant text := 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  actor_c constant text := 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  nucleus_a constant uuid := '11111111-1111-4111-8111-111111111111';
  nucleus_b constant uuid := '22222222-2222-4222-8222-222222222222';
  accepted_id uuid;
  declined_id uuid;
begin
  perform set_config('request.jwt.claim.sub', actor_a, true);
  accepted_id := public.create_nucleus_agreement(nucleus_a, 'habit', 'Conversar', 'Sem telas', 'Depois do jantar', 'Semanal');
  if (select status from public.nucleus_agreements where id = accepted_id) <> 'pending' then
    raise exception 'a proposta não iniciou pendente';
  end if;
  if (select count(*) from public.nucleus_agreement_participants where agreement_id = accepted_id) <> 1
    or (select response from public.nucleus_agreement_participants where agreement_id = accepted_id) <> 'accepted' then
    raise exception 'o autor não recebeu apenas seu próprio aceite';
  end if;

  perform set_config('request.jwt.claim.sub', actor_c, true);
  if exists (select 1 from public.nucleus_agreements where id = accepted_id)
    or exists (select 1 from public.nucleus_agreement_participants where agreement_id = accepted_id) then
    raise exception 'outro Núcleo conseguiu ler a proposta';
  end if;
  begin
    perform public.respond_nucleus_agreement(accepted_id, 'accepted');
    raise exception 'outro Núcleo conseguiu votar';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.create_nucleus_agreement(nucleus_b, 'habit', 'Sozinho', 'Sem parceiro', 'Hoje', 'Semanal');
    raise exception 'proposta sem segunda pessoa foi criada';
  exception when invalid_parameter_value then null;
  end;

  perform set_config('request.jwt.claim.sub', actor_b, true);
  if (select count(*) from public.nucleus_agreement_participants where agreement_id = accepted_id) <> 1
    or (select response from public.nucleus_agreement_participants where agreement_id = accepted_id) <> 'pending' then
    raise exception 'participante não recebeu a própria resposta pendente';
  end if;
  perform public.respond_nucleus_agreement(accepted_id, 'accepted');
  if (select status from public.nucleus_agreements where id = accepted_id) <> 'testing' then
    raise exception 'unanimidade não moveu a proposta para teste';
  end if;
  begin
    perform public.respond_nucleus_agreement(accepted_id, 'declined');
    raise exception 'proposta em teste aceitou novo voto';
  exception when insufficient_privilege then null;
  end;

  perform set_config('request.jwt.claim.sub', actor_a, true);
  declined_id := public.create_nucleus_agreement(nucleus_a, 'experience', 'Passeio', 'Ao ar livre', 'Sábado', 'Uma vez');
  perform set_config('request.jwt.claim.sub', actor_b, true);
  perform public.respond_nucleus_agreement(declined_id, 'declined');
  if (select status from public.nucleus_agreements where id = declined_id) <> 'declined' then
    raise exception 'recusa não encerrou a proposta';
  end if;
end;
$$;

reset role;
select pass('propostas exigem vínculo, mantêm respostas individuais e respeitam unanimidade e recusa');
select * from finish();
rollback;
