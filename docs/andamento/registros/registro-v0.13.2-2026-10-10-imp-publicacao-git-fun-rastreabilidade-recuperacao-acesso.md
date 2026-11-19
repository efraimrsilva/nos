# Registro — v0.13.2 — 2026-10-10 — Imp. de publicação Git com Fun. de rastreabilidade da recuperação de acesso

**Status:** conjunto validado, publicação autorizada e objeto Git inspecionado; conferir hash remoto no encerramento. Versão 0.13.2 preservada, sem mudança funcional adicional.

**Controle:** 40 arquivos incluídos; árvore inicial do commit 0573e1e34e0751ad0d17c78c1e893860528ffdd3 coincide com o índice preparado. Pendência retirada após essa comprovação, com controle incorporado ao mesmo commit lógico. Credenciais, caches operacionais e artefatos locais excluídos.

## Objetivo, contexto e requisitos

Publicar uma unidade atômica abrangendo todo o Percurso 03 desenvolvido, revisar a documentação do próximo passo e preservar a retomada neste chat. Usuário autorizou commit e push para GitHub; ativação SMTP externa depende da senha de aplicativo liberada pelo Google. Publicação Git não certifica deploy ou recebimento de e-mails.

## Escopo e decisões

- Código de recuperação: rejeição de callbacks ambíguos antes do Auth e retorno à Conta em modo login com destino interno preservado.
- Testes de regressão e integrador real local: proteção do token legítimo, nova senha, sessões e retorno padrão/específico.
- Atlas vivo: sequência 01 → 04 → 05 → 01 → 12, etapas de Conta, callback técnico sem tela própria, reinício e pendências operacionais; fichas, Visão global e galeria de computador/celular sincronizadas.
- Preparação Gmail: remetente sintagmasoftware@gmail.com, configuração isolada e script PowerShell com entrada oculta, vínculo restrito ao nos-dev e verificação remota somente leitura. Nenhuma senha versionada ou configuração SMTP aplicada.
- Versão, contratos, cobertura, histórico, Brag e continuidade incluídos na mesma unidade.

Mensagem: `fix(auth): concluir recuperação de acesso e preparar SMTP Gmail`. Corpo descreve código, testes, Atlas/comparações, preparação operacional, documentação e limites. Base main e origin/main sem divergência após fetch: e7ff9c1. Retirar pendência apenas após conferir inclusão dos arquivos no objeto Git; incorporar controle ao mesmo commit lógico e conferir HEAD contra main remoto após push.

## Validações e revisão

Em 2026-10-10: `npm.cmd test -- --workers=1` (92/92), `npm.cmd run typecheck`, `npm.cmd run build`, verificador permanente de recuperação do Atlas e conferência de links/galeria aprovados. Diff completo autorrevisado; revisão independente da implementação e script já concluída sem P1–P3 restantes. Evidência de integração real local e `-Check` remoto somente leitura preservada no registro de 2026-10-09; não confundir esses testes com envio Gmail externo.

## Arquivos, resultado e retomada

O [registro da implementação](registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md) detalha os arquivos e contratos. [Estado atual](../estado.md) concentra a continuidade e o [roteiro Gmail](../funcionalidades/recuperacao-smtp-gmail.md) contém o comando e critérios de aceite externo.

Próximo passo: após liberação do Google, gerar a senha de aplicativo, fornecê-la no prompt oculto de `scripts/configure-gmail-smtp.ps1` e certificar mensagem recebida, link, redefinição, login antigo/nova senha e destino. Criptografia ou entrada oculta da senha comum não substitui a exigência de senha de aplicativo. Retomar neste chat. Sem migração, merge ou deploy nesta publicação.
