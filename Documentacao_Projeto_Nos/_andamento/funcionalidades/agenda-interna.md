# Agenda interna — v1.0.0

**Atualização v1.0.0 — 14/10/2026:** [contrato administrativo](administracao-participacao.md) implementado localmente. Convites são geridos por administradores; Núcleos fechados não aceitam convites. Agenda usa consulta que protege autoria após saída e conserva a própria presença na reentrada. Autor associado ou administrador pode gerir eventos. Regras de criação, horários e respostas individuais permanecem.

## Histórico e contratos anteriores

**Data:** 2026-10-13. **Status:** recorte funcional validado localmente; publicação/prova online pendentes. Base existente v0.6.0 reconferida, sem migração nova.

## Percurso e telas

Início13 → Agenda14 → Novo16 → Evento/respostas15 → Editar17 opcional → Agenda14. Evento existente abre15 diretamente; ninguém precisa criar outro para responder. São seções de `/nucleos/[id]/agenda`, não quatro rotas. Links internos levam ao formulário e de volta aos eventos sem enviar. Editar/remover ficam em expansão contextual por evento. Fechar a expansão ou navegar sem salvar não grava alterações.

| Tela | Implementação existente e conclusão atual | Limite reservado |
|---|---|---|
|14 Agenda|Lista cronológica dos eventos ainda não terminados, 50 por página, desempate por ID; início/fim/fuso e estado vazio|Visão mensal/dia, filtro por assunto e histórico de eventos passados|
|16 Novo|Título até100, intenção opcional até500, início/término e fuso do dispositivo; feedback e validações|Local estruturado, recorrência, seleção individual e vínculos|
|15 Evento|Título/intenção/datas; própria resposta e estado coletivo; Posso participar ou Não posso, com processamento compartilhado|Ainda não sei, sugestão de horário, rota individual, notificações e memórias|
|17 Gestão|Autor/criador associado edita; aviso de remarcação; remoção contextual confirmada ou Manter evento sem gravação|Histórico de alterações, cancelamento com retenção, comunicação externa|

## Contrato e integrações

Sessão validada por `auth.getUser()`, associação atual conferida na página. Leitura usa RLS (segurança por linha) limitada ao Núcleo. Ações usam RPCs (chamadas de função no banco) autenticadas com `SECURITY DEFINER SET search_path = ''` e autorização própria. As RPCs existentes conservam a serialização por evento entre edição, resposta e remoção.

Criar aceita a presença do autor e inclui os integrantes atuais como pendentes. Entrada posterior permite consultar, mas não cria convite/voto retroativo. Responder exige associação e participação original. Confirmado significa todos accepted; qualquer declined mostra Precisa de novo horário; silêncio permanece pending. Esse rótulo não muda o horário nem notifica outras pessoas. Respostas alheias são legíveis aos membros pelo contrato atual; a interface apresenta agregação e resposta própria.

Título/intenção modificados conservam respostas quando os instantes não mudam. Mudança de início ou término redefine as respostas dos demais para pending e preserva a de quem edita. A edição conserva participantes originais, sem convidar recém-chegados. Datas aparecem no fuso declarado pelo evento; editor usa fuso do dispositivo e envia UTC (tempo universal coordenado) absoluto. `Intl` desconhecendo um fuso aceito no banco usa UTC como alternativa explícita.

Remover exige primeiro abrir a confirmação com nome/consequência. Checkbox obrigatório, `confirmRemoval=yes` também exigido pela Server Action; abrir/manter não executam RPC. Confirmar apaga evento e respostas por cascata, sem desfazer. Esse campo demonstra intenção na interface; a autorização continua no banco. Foco entra na confirmação e retorna ao acionador ao cancelar. `useFormStatus` fornece feedback e bloqueia repetição enquanto uma resposta/remoção processa. Hover sutil respeita movimento reduzido; não há movimento contínuo.

## Espaço futuro

Aplicativo e Atlas reservam visão mensal/dia, recorrência, local, terceiro estado de resposta, sugestão de horário, participantes individuais e acesso restrito, notificações, vínculos com Hábitos/Experiências/conversas, memória e calendários externos. Sem campos persistidos, contas conectadas ou sucesso simulado. Definir autoria/visibilidade/consentimento/retenção e conflitos antes de cada ampliação. Conversa de cuidado restrita não deve entrar na agenda atual de leitura pelo Núcleo.

## Evidências e teste manual

`tests/authenticated/calendar.spec.ts`: três casos em desktop/mobile, seis aprovados. Confirmação/ausência de ciência no servidor; paginação51 futuros mais1 passado; retorno sem criar; criação com término inválido; autor aceito/membro pendente; recusa/aceite; edição textual conservando resposta; remarcação redefinindo resposta; cancelar/confirmar remoção; RPC negada a membro sem autoria e a membro de outro Núcleo. Fixtures locais removidas. Suíte geral102 aprovada; tipos e build no registro de fechamento. [Atlas verificado](../../wireframes/tools/verify-mvp-agenda.mjs) e [galeria](../../wireframes/comparacoes/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17/index.html).

Manual: duas contas no mesmo Núcleo → Início/Abrir agenda → criar evento futuro → segunda pessoa responder → autor editar intenção e conferir conservação → remarcar e conferir nova pendência → abrir remoção/Manter e conferir persistência → confirmar ciência/remoção e conferir vazio. Conta fora do Núcleo não acessa; membro sem autoria não recebe gestão. Conferir teclado e celular, fuso e links de retorno.

Limites: falha real de rede/banco não foi provocada; não se comprovaram notificações, operação pública ou recebimento de e-mail. Página é uma fotografia da leitura; recarregar após mudanças de outras pessoas. A validação usa somente Supabase local; produção e migrações remotas permanecem fora desta autorização. Próximo recorte funcional do roteiro: MVP05 controles, quando solicitado; pendências operacionais das etapas01/02 continuam separadas.
