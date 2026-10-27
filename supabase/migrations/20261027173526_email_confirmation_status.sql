-- A confirmação deve informar o estado do endereço também sem sessão.
-- Expõe apenas o estado solicitado, sem identidade, datas ou acesso a auth.users.
create function public.get_email_confirmation_status(account_email text)
returns text language sql stable security definer set search_path = '' as $$
 select coalesce((
   select case when u.email_confirmed_at is not null then 'confirmed' else 'pending' end
   from auth.users u
   where lower(u.email) = lower(btrim(account_email))
     and u.deleted_at is null
     and u.is_sso_user = false
   limit 1
 ), 'missing');
$$;

revoke all on function public.get_email_confirmation_status(text) from public;
grant execute on function public.get_email_confirmation_status(text) to anon, authenticated;
