begin;
select plan(1);

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
  habit_id uuid;
  moment_id uuid;
begin
  perform set_config('request.jwt.claim.sub', actor_a, true);
  habit_id := public.create_nucleus_agreement(nucleus_a, 'habit', 'Conversar', 'Sem telas', 'Depois do jantar', 'Semanal');
  begin
    perform public.record_nucleus_habit_moment(nucleus_a, habit_id, 'good', 'Ainda pendente');
    raise exception 'registro em proposta pendente foi permitido';
  exception when insufficient_privilege then null;
  end;

  perform set_config('request.jwt.claim.sub', actor_b, true);
  perform public.respond_nucleus_agreement(habit_id, 'accepted');
  perform set_config('request.jwt.claim.sub', actor_a, true);
  moment_id := public.record_nucleus_habit_moment(nucleus_a, habit_id, 'difficult', '  Conversamos com calma.  ');
  if (select note from public.nucleus_habit_moments where id = moment_id) <> 'Conversamos com calma.' then
    raise exception 'nota do momento não foi gravada';
  end if;
  begin
    insert into public.nucleus_habit_moments(agreement_id, author_id, mood) values (habit_id, actor_a::uuid, 'good');
    raise exception 'inserção direta foi permitida';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.record_nucleus_habit_moment(nucleus_a, habit_id, 'perfect', '');
    raise exception 'humor inválido foi permitido';
  exception when invalid_parameter_value then null;
  end;

  perform set_config('request.jwt.claim.sub', actor_b, true);
  if (select count(*) from public.nucleus_habit_moments where agreement_id = habit_id) <> 1 then
    raise exception 'participante não viu o momento';
  end if;
  perform set_config('request.jwt.claim.sub', actor_c, true);
  if exists (select 1 from public.nucleus_habit_moments where agreement_id = habit_id) then
    raise exception 'outro Núcleo leu o momento';
  end if;
  begin
    perform public.record_nucleus_habit_moment(nucleus_a, habit_id, 'good', '');
    raise exception 'outro Núcleo registrou momento';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
select pass('momentos exigem aceite e teste, preservam autoria e isolam Núcleos');
select * from finish();
rollback;
