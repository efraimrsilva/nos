# Registro — v0.4.0 — 2026-09-27 — Imp. de integração Supabase com Fun. criação e convite

**Versão vigente do projeto:** 0.4.0

**Status:** Concluído, validado no projeto de desenvolvimento `nos-dev` e registrado em commit atômico; `origin/main` é o destino autorizado, sem publicação do aplicativo.

## Objetivo e contexto

Dar continuidade à tela Propósito com conta real, criação protegida de Núcleo, convite inicial opcional, conferência antes do aceite e resumo acessível apenas a participantes. O projeto Supabase foi criado e configurado com orientação passo a passo ao usuário, que realizou as ações de conta e credencial sem compartilhá-las no repositório.

## Requisitos e decisões técnicas

- `/conta` oferece cadastro, confirmação de e-mail, entrada e saída. As ações validam entradas no servidor e mostram erros sem simular sucesso quando o serviço está indisponível.
- `@supabase/ssr` e `@supabase/supabase-js` usam cookies de sessão; `proxy.ts` os renova. As ações e páginas protegidas confirmam a identidade com `auth.getUser()`. Os cookies usam `HttpOnly`, `SameSite=Lax` e `Secure` em produção.
- A migração `supabase/migrations/20260927173656_create_nuclei_and_invitations.sql` cria `nuclei`, `nucleus_members` e `nucleus_invitations` com RLS. Funções restritas a `authenticated` verificam `auth.uid()`; criação e associação do criador ocorrem na mesma transação. Convites usam 128 bits aleatórios e expiram em sete dias.
- A tela Propósito conserva nome e propósito apenas em memória até **Criar Núcleo**. Só o tipo validado viaja na URL. A ação explícita envia os dados ao servidor; sair ou recarregar antes dela perde o rascunho.
- `/comecar/convite-inicial/[id]` permite gerar, recuperar e compartilhar o código ativo ou seguir sem convidar. `/comecar/convite` mostra a prévia somente após conferir um código válido com sessão autenticada e a oculta se o campo for alterado. `/nucleos/[id]` apresenta um resumo protegido enquanto a Home não existe.
- `.env.example` contém apenas nomes de variáveis. URL e chave publicável locais estão em `.env.local` ignorado pelo Git; nenhum token, senha ou código de convite foi registrado em arquivos versionados.

## Arquivos e integrações

`src/app/conta/`, `src/app/auth/confirm/`, `src/app/comecar/convite/`, `src/app/comecar/convite-inicial/[id]/`, `src/app/nucleos/[id]/`, `src/features/auth/`, `src/features/invitations/`, `src/features/nuclei/actions.ts`, `src/features/onboarding/components/nucleus-purpose-form.tsx`, `src/lib/supabase/`, `src/proxy.ts`, `src/shared/routes.ts`, `supabase/config.toml`, migração SQL, `.env.example`, `next.config.ts`, `playwright.config.ts`, `.gitignore`, `package.json`, `package-lock.json`, README, especificação v2.8, documentação de andamento e testes Playwright.

## Validações realizadas

- TDD inicial: testes das novas rotas e dos estados sem serviço falharam antes da implementação e passaram depois. A suíte final aprovou **46 testes Playwright em desktop e mobile**. `npm.cmd run typecheck`, `npm.cmd run build` e `git diff --check` passaram após os ajustes finais.
- Supabase remoto: Management API autenticada e painel confirmaram a migração versão `20260927173656`, três tabelas, quatro funções e políticas RLS. A CLI 2.118.0 falhou por transporte; a aplicação via API foi executada pelo usuário e verificada no painel. Docker inativo impediu teste local do banco.
- Fluxo real: cadastro, confirmação e entrada de conta; criação de Núcleo com vínculo `creator`; geração de convite. O primeiro convite teve código exposto em captura/chat e foi revogado. Um substituto ativo foi gerado sem enviar seu código ao chat.
- A conta convidada conferiu a prévia e aceitou. A primeira tentativa redirecionou sem criar `member`; após F5, a conta convidada recebeu página não encontrada. A nova tentativa com a sessão convidada identificada criou o vínculo. Consulta agregada no banco confirmou **um `creator` e um `member`**; o resumo permaneceu visível após F5 nos dois navegadores. O contraste antes/depois confirma o acesso condicionado à associação nesse fluxo.
- Revisão independente estática: achados anteriores de prévia preservada após erro e ausência de saída da conta foram corrigidos. A revisão final encontrou prévia mantida enquanto o código digitado era alterado e documentos defasados; a interface e os registros foram corrigidos. A revisão não acessou credenciais ou dados privados.

## Resultado e limitações

O onboarding protegido, desde a conta até a entrada por convite, funcionou com contas reais no projeto de desenvolvimento. A causa exata da primeira tentativa de aceite que redirecionou sem novo vínculo não foi reproduzida; a função de banco retorna o Núcleo também quando a conta já pertence a ele. A segunda tentativa e o acesso persistente foram confirmados. O teste de expiração natural de sete dias, envio de e-mail em produção e capacidade operacional não foram realizados.

SMTP próprio, recuperação de senha, rate limiting operacional, auditoria de privacidade, Home completa e empacotamento nativo ficam para entregas futuras. A configuração atual não é uma autorização para publicar o app ou receber usuários externos. O primeiro token enviado acidentalmente no chat foi revogado segundo o usuário e não foi usado; o token restrito substituto foi mantido fora dos arquivos do projeto.

## Próximos passos

1. Transformar `/nucleos/[id]` na primeira etapa da Home do Núcleo com dados reais já disponíveis e estados vazios. Árvore, agenda e gratidão exigem contratos e permissões próprios antes de aparecerem na interface. Preservar RLS e acessibilidade.
2. Planejar SMTP, limites operacionais e privacidade antes de qualquer publicação pública.
