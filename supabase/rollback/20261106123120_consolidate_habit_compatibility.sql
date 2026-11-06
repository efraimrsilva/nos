-- Recuperação das duas funções anteriores. Executar em transação somente no ambiente confirmado.
-- Não modifica dados, consentimentos ou histórico de migrações. O aplicativo novo exige as funções novas.
CREATE OR REPLACE FUNCTION public.create_nucleus_agreement(target_nucleus uuid, agreement_category text, agreement_title text, agreement_description text, agreement_timing text, agreement_frequency text, agreement_trial_days integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare result uuid;
begin
 perform public.lock_nucleus_member(target_nucleus);
 if agreement_category is null or agreement_category not in ('habit','experience') or agreement_title is null or char_length(btrim(agreement_title)) not between 1 and 100 or agreement_description is null or char_length(btrim(agreement_description)) not between 1 and 500 or agreement_timing is null or char_length(btrim(agreement_timing)) not between 1 and 120 or agreement_frequency is null or char_length(btrim(agreement_frequency)) not between 1 and 120 or (agreement_category='habit' and (agreement_trial_days is null or agreement_trial_days not between 7 and 30)) then raise exception 'invalid agreement fields' using errcode='22023'; end if;
 insert into public.nucleus_agreements(nucleus_id,created_by,category,title,description,timing,frequency,trial_days) values(target_nucleus,auth.uid(),agreement_category,btrim(agreement_title),btrim(agreement_description),btrim(agreement_timing),btrim(agreement_frequency),case when agreement_category='habit' then agreement_trial_days else null end) returning id into result;
 insert into public.nucleus_agreement_versions(agreement_id,version,title,description,timing,frequency) values(result,1,btrim(agreement_title),btrim(agreement_description),btrim(agreement_timing),btrim(agreement_frequency));
 -- Propor não aceita por ninguém, inclusive pelo autor. O aceite é uma ação individual explícita.
 return result;
end;$function$
;
CREATE OR REPLACE FUNCTION public.record_nucleus_habit_moment(target_nucleus uuid, target_agreement uuid, moment_mood text, moment_note text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare result uuid;
begin
 perform public.lock_nucleus_agreement(target_agreement);
 if moment_mood is null or moment_mood not in ('great','good','neutral','difficult') or moment_note is null or char_length(btrim(moment_note))>500 then raise exception 'invalid moment' using errcode='22023'; end if;
 if not exists(select 1 from public.nucleus_agreements a join public.nucleus_agreement_participants p on p.agreement_id=a.id where a.id=target_agreement and a.nucleus_id=target_nucleus and a.category='habit' and a.status in ('testing','active') and p.user_id=auth.uid() and p.response='accepted' and p.accepted_version=a.terms_version) then raise exception 'not authorized or current terms not accepted' using errcode='42501'; end if;
 insert into public.nucleus_habit_moments(agreement_id,author_id,mood,note) values(target_agreement,auth.uid(),moment_mood,nullif(btrim(moment_note),'')) returning id into result;
 return result;
end;$function$
;
