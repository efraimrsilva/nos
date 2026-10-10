# Registro — v0.13.2 — 2026-10-09 — Imp. de recuperação de acesso com Fun. de Percurso 03

**Status:** implementação local concluída, revisada e validada; envio externo Gmail pendente. Versão PATCH 0.13.2 registrada após as verificações; durante o desenvolvimento a versão 0.13.1 foi preservada.

## Objetivo, contexto e requisitos

Conferir e completar o Percurso 03 Recuperar acesso no Atlas vivo e no aplicativo. A base Git é `e7ff9c1`, branch main, sem alterações preexistentes. O fluxo já estava integrado ao Supabase Auth, mas o retorno à Conta abria cadastro e o callback interpretava alguns parâmetros misturados/repetidos como credencial única. Usuário indicou `sintagmasoftware@gmail.com` e escolheu Gmail; não possui SMTP configurado.

Critérios: sequência lógica, retorno à aba de login com destino interno preservado, rejeição de entradas ambíguas antes do Auth, recuperação local completa, Atlas/documentação/comparação coerentes e limites externos explícitos.

## Decisões e plano proporcional

1. Reproduzir as falhas e adicionar testes de regressão.
2. Extrair somente a leitura de credenciais para função pura; manter validação do método de recuperação, prova assinada, validade e atualização no servidor.
3. Corrigir retorno de Conta e representar as etapas na mesma fonte dos Percursos e Visão global. Preservar IDs 01 → 04 → 05 → 01 → 12. Callback não cria uma tela; retorno específico substitui 12 quando válido.
4. Testar unidade, navegador, recuperação real local, tipos, build e Atlas; revisar diff e registrar evidências.
5. Preparar configuração Gmail sem credencial no repositório; certificar entrega externa somente após configuração e recebimento comprovados.

Mudança PATCH, sem dependência, migração ou nova rota. Sem commit, push, merge ou deploy autorizado nesta solicitação.

## Arquivos e integrações

- `src/features/auth/recovery-credentials.ts`: parser delimitado para code ou token_hash, sem ambiguidades.
- `src/app/auth/recovery/route.ts`: rejeita entradas inválidas antes de consultar Auth; demais verificações preservadas.
- `src/features/auth/components/access-heading.tsx`: confirmação/recuperação retornam à Conta em modo login, preservando next.
- `tests/recovery-proof.spec.ts`, `tests/account-entry.spec.ts`: regressões de segurança e navegação.
- `scripts/verify-account-local.mjs`: margem para compilação inicial, credenciais ambíguas sem consumir link, recuperação direta até Seus Núcleos e login comum sem autorização de troca.
- Atlas: `screens.js`, `atlas.js`, `global-view.js`, `product-ui.js` e `atlas.css`; subtítulos contextuais e retorno ao login.
- [Verificador do percurso](../../wireframes/tools/verify-recovery-journey.mjs), [roteiro Gmail](../funcionalidades/recuperacao-smtp-gmail.md) e [galeria](../../wireframes/comparacoes/v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html).
- `supabase/operacao/gmail/supabase/config.toml` e `scripts/configure-gmail-smtp.ps1`: preparação solicitada após o bloqueio do Google; campos SMTP definidos e senha recebida somente por prompt oculto/ambiente do processo. Configuração isolada preserva o ambiente local. CLI confere projeto e escopo antes de aplicar.

## Validações realizadas

- TDD (desenvolvimento guiado por testes): parser com lógica anterior falhou para credenciais misturadas; correção passou nos cinco testes unitários.
- Integração no Supabase local: cadastro/reenvio/confirmacão; recuperação PKCE e direta; senha inválida/divergente; senha antiga recusada e nova aceita; refresh token de outra sessão revogado; link reutilizado e prova adulterada rejeitados; parâmetros ambíguos não consomem token; retorno específico de convite e padrão de Seus Núcleos; login comum não abre redefinição. Contas/e-mails temporários removidos e servidor encerrado.
- Atlas: sintaxe dos quatro scripts modificados; Visão global de 72 telas; verificador específico em desktop/celular, sem erro JavaScript ou rede externa.
- `npm.cmd test -- --workers=1`: 92/92 aprovados em desktop/celular na repetição completa. Primeiro servidor excedeu a espera de 120 segundos; uma execução seguinte teve 91/92, com espera de cinco segundos insuficiente na compilação inicial de Boas-vindas; repetição completa passou, sem alteração nessa tela.
- `npm.cmd run typecheck` e `npm.cmd run build`: aprovados. `git diff --check`: aprovado. Sintaxe dos scripts do Atlas e do integrador conferida.
- `scripts/verify-account-local.mjs`: primeira execução parou durante compilação da confirmação; margem explícita de 90 segundos por asserção resolveu a espera, sem repetir operações de escrita. Execução completa aprovada e limpeza confirmada.
- Autorrevisão do diff e revisão independente somente leitura do código: nenhum achado P1–P3 restante. Capturas inspecionadas; subtítulos do percurso separados visualmente após inspeção. Registros, índices e contrato sincronizados.
- Verificador do Atlas passou também para retorno das saídas de contrato/ficha ao login, após reproduzir falha de estado nessas saídas e corrigir a metainformação compartilhada.
- `scripts/configure-gmail-smtp.ps1 -Check`: TOML e acesso ao nos-dev aprovados, sem escrita remota. Campos declarados limitados a SMTP; saídas brutas e senha não impressas. Aplicação com credencial real e recebimento ainda não executados.
- Encerramento: build reconferido na v0.13.2; 419 links locais dos documentos alterados e imagens da galeria aprovados. Ambiente local do aplicativo confere nos-dev, origem, chave pública e segredo de recuperação suficiente, sem expor valores. Cache operacional ignorado pelo Git. Supabase local encerrado com backup; prévia da galeria servida somente na porta local 3400.

## Resultado, limites e próximos passos

Implementação local corrigida e validada, versão PATCH 0.13.2 em estado.md, package.json e package-lock.json. Preparação Gmail concluída; usuário informou bloqueio de confirmação do Google, exigindo dispositivo/fator registrado por pelo menos sete dias. Após liberação, gerar senha de app e informá-la no prompt oculto do comando preparado (ou painel Supabase). Não foi enviado e-mail externo nem certificado ambiente HTTPS de publicação. JWT (token de acesso) emitido permanece válido até expirar, conforme contrato existente; revogação global impede renovação. Próximo passo executável: aplicar SMTP com senha de app e comprovar recuperação externa com conta autorizada. Unidade lógica pronta e ainda não commitada; sugestão `fix(auth): concluir recuperação de acesso e preparar SMTP Gmail`.

Ferramentas: Superpowers de entendimento, depuração, testes, revisão e verificação aplicados. Context7 ativo e consultado para Supabase; versões instaladas mantidas. Octocode CLI 19.1.0 disponível e consultada para dependentes de AccessHeading; grafo sintático parcial complementado por busca local (três rotas). Supabase CLI 2.118.0 e Docker na integração local, mais `config diff` remoto somente leitura para conferir preparação SMTP. Sem reset do banco ou alteração remota. Revisão independente adicional do script/Atlas e sintaxe PowerShell sem P1–P3; limite de aplicação real permanece explícito.
