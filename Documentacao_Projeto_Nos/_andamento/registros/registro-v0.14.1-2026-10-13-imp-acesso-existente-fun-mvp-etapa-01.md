# Registro — v0.14.1 — 2026-10-13 — Imp. de acesso existente com Fun. MVP etapa 01

**Status:** correção concluída e validada localmente; etapa 01 ainda depende de certificação operacional. PATCH 0.14.0 → 0.14.1. Documentação inicialmente dispensada e posteriormente autorizada pelo usuário nesta mesma interação.

## Objetivo, contexto e requisitos

Conferir a etapa 01 “Começar pelo login existente” no MVP do Atlas vivo, telas 01, 02, 03, 04, 05 e 72, e concluir pendências de implementação antes de avançar. Conferir login/cadastro, confirmação/reenvio, recuperação/revogação, renovação, saída, retorno interno e convite; Boas-vindas permanece opcional. Não aceitar convites por efeito do login nem confundir testes locais com recebimento externo.

## Decisões e implementação

A revisão encontrou uma pendência P2: qualquer falha do login orientava conferir e-mail/senha, inclusive transporte, erro 5xx ou limite 429. A consulta pública de sessão também descartava o erro do Auth.

- Login distingue limite de tentativas (aguardar), transporte/5xx (serviço indisponível) e credenciais inválidas (resposta genérica preservada).
- Raiz preserva a falha de consulta em `/conta?erro=servico`; Conta informa que não conseguiu conferir a sessão e permite nova tentativa. Ausência de sessão continua sendo um caso separado.
- O helper de sessão existente é reutilizado apenas nas consultas `getUser`. Não é utilizado para classificar login, pois seus códigos de erro representam outro contrato.
- Recuperação e reenvio mantêm mensagens neutras para evitar descoberta de contas. Redefinição revoga renovação de outras sessões; tokens de acesso emitidos continuam sujeitos à expiração.
- Atlas, MVP e ficha da Conta passam a explicitar o comportamento e o bloqueio Gmail. Nenhuma nova tela, rota, migração ou dependência.

## Arquivos e integrações

Código: `src/features/auth/actions.ts`, `src/app/page.tsx`, `src/app/conta/page.tsx`. Testes: `tests/auth-service.spec.ts`, `tests/account-entry.spec.ts`. Versão: `package.json` e `package-lock.json`. Atlas: `atlas.js`, `screens.js`, `mvp-plan.js`, `index.html`. README, plano MVP, contrato Conta/entrada, cobertura/fidelidade, andamento, histórico e Brag atualizados.

Supabase Auth continua responsável por identidade, sessão, confirmação, senha e limites. O proxy de proteção e os contratos de autorização foram preservados. O teste de ação executa o código real com transporte controlado, usando `node:vm` e remoção de tipos disponível no Node 24; não toca cookies ou redirecionamento em login falho.

## Validações e evidências

- Antes da correção: 92 testes gerais, análise de tipos e build aprovados; 14 testes autenticados de sessão, computador/celular, aprovados. Estes 14 casos foram executados antes da mudança de mensagens, não repetidos depois.
- Regressão: duas falhas esperadas para indisponibilidade/limite e uma aprovação para credenciais inválidas; após corrigir, 3/3 aprovados. A tipagem identificou argumento obrigatório no construtor de erro do teste; corrigido antes da execução final.
- Depois da correção: geração de tipos, TypeScript e build de produção aprovados; 100/100 testes gerais, computador/celular, aprovados. Executados por `node artifacts/verify-publication-local.mjs`, com cópia de fontes/configuração/testes verificada por SHA-256 e sem `.env.local`.
- Jornada real de e-mail local: cadastro, reenvio, confirmação, retorno ao convite sem aceite automático, recuperação PKCE, nova senha, revogação de outra sessão, senha antiga rejeitada, novo login, link reutilizado, token direto, parâmetros ambíguos, prova adulterada e resposta neutra aprovados. Contas/e-mails temporários removidos. O servidor dev não iniciou no orçamento do verificador; a mesma jornada passou em cópia local compilada para produção, somente com Supabase/Mailpit locais.
- Atlas: MVP, Visão global e Percurso 03 aprovados, sem erros JavaScript ou chamadas externas. Sintaxe dos arquivos alterados conferida. Galeria com seis imagens carregadas e inspeção visual; 501 alvos locais de links conferidos, sem ausências. Versão consistente em package/lock.
- Preparação Gmail: `scripts/configure-gmail-smtp.ps1 -Check` aprovado; configuração e acesso remoto conferidos somente em leitura. Não ativa SMTP nem comprova envio/recebimento.
- Revisão independente encontrou o P2 e reconferiu a correção sem achados relevantes restantes. Autorrevisão do diff e `git diff --check` aplicadas.
- [Comparação visual](../../wireframes/comparacoes/v0.14.1-2026-10-13-acesso-indisponivel-tela_01/index.html): mesma URL antes/depois, com aviso e retorno ao convite preservado. O parâmetro de erro demonstra apresentação, não uma interrupção real de rede de ponta a ponta. Regressão da ação usa erros controlados do SDK.

Superpowers: depuração, testes de regressão, revisão e verificação. Context7: documentação Supabase de revogação global/expiração de tokens; versão instalada preservada, sem migração. Octocode 19.1.0: dependências sintáticas de Auth em cópia local; grafo parcial e alias externos complementados por leitura precisa do código. Não foi medida economia de tokens.

## Resultado, limitações e próximos passos

Nenhuma outra pendência de implementação relevante encontrada nas seis telas. A etapa 01 permanece aberta operacionalmente: usuário confirmou em 13/10/2026 que o Google ainda não liberou a senha de aplicativo do Gmail. A preparação está disponível; ativação depende dessa liberação e de entrada oculta no terminal. Depois, comprovar confirmação e recuperação recebidas em e-mail externo, retorno ao convite e revogação no ambiente de uso; conferir `APP_ORIGIN`, URLs autorizadas e segredo de recuperação nesse ambiente, com HTTPS para publicação.

Supabase local encerrado com backup, sem reset, após remover contas/e-mails temporários; servidores da galeria encerrados.

Não houve ativação Gmail, envio externo, alteração remota de banco/configuração, commit, push ou deploy. Próximo passo executável: após liberação do Google, executar o script SMTP sem `-Check` com a senha de aplicativo no prompt oculto e realizar a jornada externa autorizada. Não avançar declarando o critério operacional da etapa 01 concluído.

**Unidades pendentes de commit:** nenhuma. Inclusão da entrega comprovada no objeto Git e registrada na [publicação autorizada](registro-v0.14.1-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-01.md). A pendência Gmail é externa e permanece explicitamente documentada. A declaração de ausência de commit/push acima corresponde ao encerramento original da implementação, anterior à autorização de publicação.
