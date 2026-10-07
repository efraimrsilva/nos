# Registro — v0.12.0 — 2026-10-07 — Imp. de Conta e entrada com Fun. de recuperação integrada

**Status:** concluído e validado no ambiente local; configurações de integração do nos-dev aplicadas e reconferidas. Sem commit, push Git ou deploy do aplicativo.

## Objetivo, contexto e requisitos

Usuário solicitou conferir e concluir toda a área 01 — Conta e entrada do Atlas vivo. Conferência encontrou cadastro/login/retorno de confirmação existentes e recuperação/redefinição ausentes. A confirmação não tinha reenvio ou rota visual; a raiz abria Escolher caminho. Usuário reforçou que aplicativo e atlas devem ter os mesmos aspectos e toda diferença deve ser apresentada.

Escopo: telas 01–05 e 72, segurança e retorno de convite necessários ao fluxo; sincronização de composição, fichas, inventário, percurso e evidências visuais. Preservadas alterações documentais preexistentes no Git. A Entrada afetiva 72 foi identificada na auditoria completa e implementada em /boas-vindas, com acesso opcional a partir de Conta e modos cadastro/login explícitos. A área não inclui os módulos de preferências, login social, biometria, exclusão, perfil ou dados de Nossa Árvore.

## Decisões e integrações

Reutilizados Next.js 16.3.6, React 19.3, Supabase JS 2.117.2 e SSR 0.12.7 instalados, sem nova dependência. OnboardingShell e tokens vigentes fornecem apresentação das telas 03–05. O desenho genérico anterior foi substituído no atlas pelo layout real compartilhado. Conta/cadastro continuam em abas; novas rotas `/conta/confirmar-email`, `/conta/recuperar`, `/conta/nova-senha` e callback `/auth/recovery`. A raiz abre Conta; retorno interno autorizado atravessa autenticação e não aceita convites automaticamente.

Prova HMAC curta ligada a usuário e sessão; `getUser` consulta Auth e `getClaims` valida JWT. Código PKCE de recuperação exige método `recovery` nos claims assinados; não confiar no tipo da query ou no marcador de cookie. Token direto exige tipo recovery. Sem chave de servidor ou prova válida, ação de redefinição bloqueada. Política atual de oito caracteres/letra/número/símbolo mantida em cadastro e redefinição; máximo 128. Proposta documental de 15 permanece futura.

Após senha nova, revogação global de refresh tokens e nova entrada. Nenhuma promessa de revogação instantânea de JWT emitido. Resposta de e-mail permanece neutra inclusive em falha SMTP ou transporte; diagnóstico interno sem dados pessoais. Intervalo por navegador 60 segundos complementa os limites do Auth.

`nos-dev`: CLI 2.118.0 apresentou diff de configuração; arquivo temporário declarou somente retornos de confirmação/recuperação (com next) e mínimo oito. Ambas propriedades aplicadas; nova comparação mostrou zero mudanças pendentes nesses campos e outros 11 campos preservados. URL de teste 3200 não foi enviada ao remoto. Chave local criada em `.env.local` ignorado pelo Git; sem segredo no conjunto versionado.

## Arquivos

- App: `src/app/page.tsx`, `src/app/conta/page.tsx`, três páginas novas em Conta, `src/app/boas-vindas/page.tsx`, `src/app/globals.css` e callbacks de confirmação/recuperação.
- Auth: ações de cadastro/login e acesso, validação compartilhada, protocolo de confirmação, prova/sessão de recuperação, formulários e cabeçalho.
- Integração de convite: link de autenticação preserva `next=/comecar/convite`.
- Configuração: `next.config.ts`, `.env.example`, `supabase/config.toml`, `package.json` e `package-lock.json` em 0.12.0.
- Evidência: testes account-entry/recovery-proof, atualizações de account/confirmation-protocol/onboarding, `scripts/verify-account-local.mjs` e verificador visual da área.
- Atlas: screens/product-ui/product.css/atlas.js, GUIA/COBERTURA/FIDELIDADE, índice e galeria de comparação com 18 capturas. Documentação de segurança v2.8 sincronizada sem perder revisão preexistente.
- Continuidade: estado/histórico/BRAG, plano e contrato da funcionalidade, README.

## Validações e revisão

Testes escritos antes das telas: cinco falhas por rotas/ações ausentes confirmaram pendências. Falhas posteriores de seletores foram diagnosticadas como conflito com anúncio acessível do Next, resolvido delimitando main. Jornada real identificou troca indevida de hostname interno; callbacks passaram a usar APP_ORIGIN, com alternativa quando vazio.

Suíte final: 108/108 desktop/mobile. Tipos e build aprovados; validação final de manifestos e diff registrada no estado. Jornada real local: cadastro, reenvio, confirmação, retorno de convite, recuperação PKCE, token direto em outro contexto, validação/política/igualdade, senha antiga negada, nova aceita, sessão de outro dispositivo sem renovação, link reutilizado e prova adulterada rejeitados; resposta neutra para inexistente. Dados temporários limpos.

Atlas completo: 72 telas, 178 saídas, 360 estados, 41 referências, 52 layouts/28 fontes históricas, 13 percursos, nenhum erro JavaScript ou recurso externo. Comparação de seis telas em celular/web confirmou títulos/subtítulos/rótulos/cor/fonte dos títulos, sem transbordamento. [Antes e depois](../../wireframes/comparacoes/2026-10-07-conta-entrada/index.html).

Autorrevisão e revisão independente da skill requesting-code-review. Três P2 corrigidos: diferença pública em falha SMTP dependente de existência, orientação impossível após falha de revogação, origem vazia inválida. Leitura final do revisor sem novos achados.

## Resultado, limitações e continuidade

Todas as telas do escopo têm implementação e integração executável; 04/05/72 deixam Planejada, total do atlas passa a 42 planejadas e 30 recortes existentes. MINOR 0.12.0 por novas rotas e fluxo compatível. “Recorte existente” continua indicando limites operacionais sem inventar readiness de lançamento.

Não certificado SMTP/domínio/remetente de produção; não feita jornada autenticada remota nem deploy. Chave e URLs HTTPS devem ser configuradas no destino de publicação. E-mail inexistente, erro de entrega e limitação do serviço preservam resposta pública neutra. Expiração real do link é responsabilidade do Auth; a aplicação verifica a rejeição e não altera seu relógio de produção.

Unidade pronta para commit: concluir Conta e entrada com recuperação segura e atlas sincronizado. Próximo passo operacional: validar remetente/entrega no ambiente de lançamento. Próximo módulo planejado: Nossa Árvore com fontes de indicadores reais.
