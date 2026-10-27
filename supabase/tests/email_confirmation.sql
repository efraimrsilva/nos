begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select no_plan();

insert into auth.users(id,email,email_confirmed_at,is_sso_user) values
 ('14000000-0000-4000-8000-000000000001','confirmed-local@example.test',now(),false),
 ('14000000-0000-4000-8000-000000000002','pending-local@example.test',null,false);

set local role anon;
select is(public.get_email_confirmation_status(' CONFIRMED-LOCAL@EXAMPLE.TEST '),'confirmed','sem sessão reconhece endereço confirmado e normaliza entrada');
select is(public.get_email_confirmation_status('pending-local@example.test'),'pending','sem sessão reconhece confirmação pendente');
select is(public.get_email_confirmation_status('missing-local@example.test'),'missing','sem sessão não promete envio a conta inexistente');
select ok(not has_table_privilege('anon','auth.users','select'),'consulta não libera tabela de usuários');

reset role;
set local role authenticated;
select is(public.get_email_confirmation_status('confirmed-local@example.test'),'confirmed','com sessão reconhece confirmação');
select is(public.get_email_confirmation_status('pending-local@example.test'),'pending','com sessão reconhece pendência');
select is(public.get_email_confirmation_status(null),'missing','entrada nula não retorna conta');
reset role;
select * from finish();
rollback;
