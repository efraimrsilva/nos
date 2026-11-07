# Registro — v3.9.0 — 2026-11-06 — Imp. de autenticação com Fun. login social

**Status:** implementação concluída e validada localmente; ativação operacional e autenticação externa pendentes de configuração dos provedores. **Versão:** 3.9.0, MINOR (nova funcionalidade compatível), após revisão/validação do código. Não apresentar como login externo já operacional.

## Objetivo, contexto e requisitos

Adicionar Google e, em seguida, Apple na Conta. “iCloud” interpretado como Iniciar sessão com a Apple; fluxo aprovado pelo usuário. O usuário confirmou que ainda não configurou os provedores. Base feat/modelo-habito/2e0347b, inicialmente limpa. Alterações documentais concorrentes em AGENTS.md, protocolo de caixa preta, estado/histórico e dois registros de diretrizes foram preservadas. Sem autorização de commit/push/deploy ou configuração remota nesta solicitação.

Critérios locais: ordem Google/Apple no cadastro/login; início permitido somente para provedores ativados; callback PKCE com destino interno/convite preservado; cancelamento/erro e nome ausente tratados; gravação autenticada do nome, interface desktop/celular e Atlas coerentes. Login real permanece critério operacional pendente.

## Decisões e integrações

Reutilizados Supabase Auth, cliente SSR0.12.7, cookies httpOnly/SameSite=Lax e allowlist existente de destinos. Nenhuma biblioteca adicionada. Avaliação breve de frameworks: outro gerenciador de sessão duplicaria a integração já usada pelo proxy/banco; SDKs específicos dos provedores não agregam necessidade concreta ao fluxo web autorizado. Benefício esperado: menor manutenção, sem métrica de custo/performance inventada. [Contrato e guia de ativação](../funcionalidades/login-social.md).

Ação do servidor valida provedor e APP_ORIGIN e solicita signInWithOAuth com skipBrowserRedirect; SSR grava o verificador PKCE. Callback troca um único código por sessão, rejeita credenciais ambíguas/misturadas, não reflete erro externo, remove a prova anterior de recuperação e retorna ao destino permitido. Resposta sem cache e sem Referer; logs de desenvolvimento ignoram a rota. Nenhum aceite de convite, adesão ou migração de banco.

Nome existente preservado; full_name válido integrado a name. Falha retornada ou exceção ao salvar nome após autenticar encaminha ao complemento; não afirma perda da sessão. Nome ausente abre /conta?completar=nome com próximo destino preservado. saveProfileName existente confere sessão e identificador da própria conta; rejeita entrada vazia/maior que80. Nome nunca autoriza acesso.

GOOGLE_AUTH_ENABLED e APPLE_AUTH_ENABLED falsas por padrão; sem segredos no frontend. Usuário recebe indisponibilidade até ativação. Supabase local possui retorno callback adicional em config.toml, sem aplicar configuração a serviço existente ou remoto. Apple requer Services ID/chave e rotação do segredo web em até seis meses; guia explica os dois endereços de retorno, sequência Google→Apple e desativação por variável.

## Arquivos alterados

- src/features/auth/social-session.ts e social-actions.ts: validação, integração e ações.
- src/features/auth/components/social-login.tsx e auth-form.tsx; src/app/conta/page.tsx: botões, feedback e complemento do nome.
- src/app/auth/callback/route.ts; next.config.ts; .env.example; supabase/config.toml; accounts-layout.css.
- tests/social-login.spec.ts, social-session.spec.ts e authenticated/social-profile.spec.ts.
- Atlas: product-ui.js, atlas.js, product.css, screens.js, mvp-plan.js e index.html. Mesmas73 fichas/13 etapas; estado Sucesso demonstra complemento sem persistir. Sem novo modal.
- Manifestos3.9.0, README/contrato/MVP/guia, continuidade/histórico/Brag e [galeria11 imagens](../../wireframes/comparacoes/v3.9.0-2026-11-06-login-social-tela_01-tela_02/index.html).

## Validações e falhas preservadas

1. RED: teste de ordem dos botões falhou pela ausência dos provedores antes da implementação. O servidor público de testes no G: excedeu120s; foi usada configuração descartável em artifacts apontando ao servidor já existente na porta3000. Nesta rota somente testados estados sociais indisponíveis e callbacks inválidos; sem cadastro/login externo pessoal.
2. Rodada inicial32:24 passaram;8 falharam por seletor ambíguo de alert (anunciador do Next) e matcher incompatível com objetos de VM. Corrigidos os testes após evidência; rodada selecionada66 passou. Regressões existentes de senha, confirmação e perfil incluídas.
3. Teste de exceção ao salvar nome após autenticar falhou (error em vez de name), implementação corrigida; rodada final68 aprovada em desktop/mobile. Comando executado: npx playwright test tests/social-session.spec.ts tests/social-login.spec.ts tests/auth-service.spec.ts tests/confirmation-protocol.spec.ts tests/profile-name.spec.ts --config=artifacts/playwright-social.config.ts --workers=2 --timeout=60000 --reporter=line. Configuração descartável, não versionada; configuração padrão permanece para ambientes sem a limitação do volume.
4. Testes autenticados: primeira rodada2/4, remoção global de cookies fazia o sincronizador retirar o formulário antes do clique; segunda2/4, route.continue não remove Cookie, por restrição documentada do navegador. Context7Playwright1.63.0 confirmou a causa. Teste corrigido para enviar o corpo real da ação via fixture HTTP isolada sem cookies. Rodada final4/4 aprovada, com gravação no banco, retorno ao convite, validação e recusa sem sessão. Não são falhas mascaradas do aplicativo.
5. npm run typecheck aprovado na v3.9.0. npm run test:authenticated -- tests/authenticated/social-profile.spec.ts, com NOS_DISABLE_TRACE=1, compilou produção Next16.3.6 --webpack na cópia C: conferida por SHA-256 e executou4/4. Cópia temporária e servidor3200 removidos/encerrados pelo executor; servidor3000 e Supabase preexistentes preservados. Consulta local final:0 contas routing-%@example.test.
6. Verificadores Atlas global/MVP e script delimitado social aprovados, sem erros ou chamadas externas. Inspeção visual do aplicativo/Atlas em desktop/celular e complemento autenticado;11 capturas na galeria. Verificador geral verify-account-fidelity.mjs falhou ao procurar #screen-preview .product-content>h3 (timeout30s): usa seletores da composição antiga, já ausentes no layout vivo anterior; a alteração desta entrega não removeu esse elemento. Não alterado por estar fora do recorte. A verificação específica social, global/MVP e inspeção visual passaram.
7. Autorrevisão do diff e revisão independente somente leitura, inclusive delta de exceção do nome/Atlas/teste autenticado: sem achados P1–P3 pendentes. Revisão independente não executou testes; evidência de execução é desta tarefa.

## Ferramentas e limites

Superpowers entendimento/TDD/depuração/revisão/verificação e checklist React aplicados proporcionalmente; skill Supabase. Context7SSR0.12.7 e Playwright1.63.0; versões do projeto preservadas. OctocodeCLI19.1.0 operacional: grafo de dependentes de auth/input consultado, sintático/parcial por imports não resolvidos, complementado por leitura local. Sem percentual de economia medido. Changelog Supabase obtido por fetch com CA do sistema após navegador recusar Markdown; alterações de TLS/SDKs e SAML self-hosted não exigiram mudança desta integração.

Provedores não configurados; nenhuma troca OAuth externa real, consentimento, cookie de sessão após callback externo, Safari ou dispositivo físico certificado. Contas de teste somente locais. Nenhuma suíte completa do banco executada: não houve mudança de SQL/esquema/permissões. Limitação histórica de migrações locais permanece fora do escopo.

## Resultado e próximo passo

Código/Atlas/documentação preparados na3.9.0, testes locais aplicáveis aprovados. Configurar Google conforme guia, validar com conta autorizada, depois configurar Apple e validar também nome ausente/Ocultar meu e-mail. Segredos por canal seguro; não solicitar valores pelo chat. Roteiros de caixa preta existentes preservados; novos apenas mediante autorização conforme AGENTS vigente. Uma unidade funcional pronta para commit, separada das duas diretrizes documentais concorrentes. Sem commit/push/deploy nesta entrega.

**Fechamento documental:**574 referências locais conferidas nos documentos selecionados; nenhuma ausência nova. Três referências históricas de estado.md para tecnologias/frontend.md já estavam ausentes em HEAD, preservadas fora do escopo. Manifestos3.9.0 coerentes, galeria11 imagens/manifesto conferida e diff sem erro de whitespace. Verificador antigo de fidelidade da Conta permanece limitado pelo seletor anterior.
