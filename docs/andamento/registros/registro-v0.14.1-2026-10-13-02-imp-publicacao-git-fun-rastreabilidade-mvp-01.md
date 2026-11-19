# Registro — v0.14.1 — 2026-10-13 — Imp. de publicação Git com Fun. rastreabilidade MVP 01

**Status:** commit atômico criado e inclusão comprovada; push para main autorizado pelo usuário. Conferência remota no encerramento. Versão 0.14.1 preservada.

## Objetivo e contexto

Publicar no GitHub toda a entrega atual com descrição abrangente: correção de mensagens de autenticação, testes de regressão, sincronização do MVP/Atlas, comparação visual, documentação e versão. A autorização é para commit/push; não inclui deploy ou ativação SMTP.

## Requisitos e decisões

Base local `2c7a836`, branch main, remoto `https://github.com/efraimrsilva/nos.git`. Fetch confirmou divergência 0/0 antes da publicação. Código, testes, Atlas, imagens, documentos e manifestos compõem a mesma mudança lógica. Não incluir artifacts, caches, credenciais ou resultados de testes.

## Arquivos e integrações

Conjunto descrito no [registro da implementação](registro-v0.14.1-2026-10-13-imp-acesso-existente-fun-mvp-etapa-01.md), com nova evidência de publicação neste documento e controle no estado/histórico. Preservar os registros históricos e incorporar a retirada da pendência ao mesmo commit, somente após comprovar inclusão no objeto Git.

## Validação e resultado

Reconferência aprovada: geração de tipos, TypeScript, build de produção e 100/100 testes gerais antes do commit, em cópia local conferida por SHA-256 sem .env.local. MVP, Visão global e Percurso 03 aprovados; 501 links documentais locais e seis imagens da galeria conferidos. Revisão do diff completo e do índice aprovadas; 29 arquivos incluídos no objeto Git, árvore inicial 935142e09add8e73171ec69acd3d90f901c82e6c idêntica ao índice preparado. Pendência retirada somente após essa comprovação e controle incorporado ao mesmo commit lógico antes de push. Confirmar hash remoto igual ao HEAD, divergência 0/0 e ausência de alterações pendentes no encerramento.

## Limitações e próximo passo

SMTP Gmail continua aguardando liberação da senha de aplicativo pelo Google, conforme confirmação do usuário. Recebimento externo, origem/URLs/segredo do ambiente de uso continuam pendentes. Jornada de e-mail validada apenas localmente na entrega anterior. Publicação no GitHub não certifica deploy nem operação externa. Próximo passo do produto: desbloquear Gmail e certificar o fluxo externo da etapa 01.
