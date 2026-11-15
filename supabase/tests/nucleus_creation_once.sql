begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select plan(11);
insert into auth.users(id) values('77000000-0000-4000-8000-000000000001'),('77000000-0000-4000-8000-000000000002');
select ok(not has_function_privilege('anon','public.create_nucleus_once(uuid,text,text,text)','execute'),'somente sessão autenticada pode chamar');
set local role authenticated;
select set_config('request.jwt.claim.sub','77000000-0000-4000-8000-000000000001',true);
select is(public.create_nucleus_once('67000000-0000-4000-8000-000000000001','amigos',' Nosso jardim ',' Cultivar cuidado '),
  '67000000-0000-4000-8000-000000000001'::uuid,'primeira confirmação cria o Núcleo');
select is(public.create_nucleus_once('67000000-0000-4000-8000-000000000001','amigos','Nosso jardim','Cultivar cuidado'),
  '67000000-0000-4000-8000-000000000001'::uuid,'repetir a confirmação devolve o mesmo Núcleo');
select is((select count(*) from public.nucleus_members where nucleus_id='67000000-0000-4000-8000-000000000001'),1::bigint,'uma única associação');
select is((select role from public.nucleus_members where nucleus_id='67000000-0000-4000-8000-000000000001'),'admin','criação associa como administrador');
select is((select name from public.nuclei where id='67000000-0000-4000-8000-000000000001'),'Nosso jardim','mantém normalização de campos');
select throws_ok($$select public.create_nucleus_once('67000000-0000-4000-8000-000000000002','inexistente','Nome','Propósito')$$,'22023','invalid nucleus fields','tipo precisa pertencer ao catálogo');
select throws_ok($$select public.create_nucleus_once('67000000-0000-0000-0000-000000000003','amigos','Nome','Propósito')$$,'22023','invalid nucleus fields','confirmação exige identificador navegável');
select lives_ok($$select public.create_nucleus('familia','Segundo Núcleo','Outro vínculo')$$,'entrada anterior permanece compatível');
select set_config('request.jwt.claim.sub','77000000-0000-4000-8000-000000000002',true);
select throws_ok($$select public.create_nucleus_once('67000000-0000-4000-8000-000000000001','amigos','Nosso jardim','Cultivar cuidado')$$,'42501','nucleus unavailable','outra conta não reutiliza a confirmação');
select is((select count(*) from public.nuclei where id='67000000-0000-4000-8000-000000000001'),0::bigint,'conta sem vínculo não lê o Núcleo');
select * from finish();
rollback;
