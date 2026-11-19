# Registro — v4.0.0-alpha.22 — 2026-11-19 — Imp. da paridade Angular com Fun. de gestão de eventos

**Status:** concluída localmente na branch `codex/migracao-angular`, a partir de `614ba95`.

## Objetivo e decisões

Portar das referências Next.js v3.11.1 e Atlas o agrupamento de horários, a apresentação do fuso, os avisos de presença e a confirmação destrutiva. Reutilizar os campos nativos, a lógica de datas existente e os diálogos compartilhados, sem dependência nova.

## Arquivos, integração e resultado

- `calendar-page.html`, `calendar-page.ts` e `calendar-dialog.css` agrupam início, término e fuso. Na validação de horários, o foco retorna ao campo inválido e a mensagem fica associada até a próxima edição de horário.
- **Novo momento** abre **Adicionar evento** para integrantes com acesso à Agenda. **Editar evento** abre o dado salvo para quem tem permissão de gestão. **Cancelar**, X, Escape e clique ou toque fora retornam à Agenda. Reabrir após cancelar recupera os dados salvos. A criação ou edição confirmada retorna à semana e ao evento.
- **Remover evento**, no detalhe da Tela 15, abre confirmação para quem tem permissão de gerir. **Manter evento** fecha e preserva o evento. Confirmar após ciência explícita remove também as respostas. O Atlas demonstra os controles sem escrita.
- As operações continuam usando autorização e confirmação do Supabase. Alterar título ou intenção mantém as respostas. Remarcar pede nova resposta aos demais participantes. Os arquivos de dados e as migrações ficaram fora da alteração.

## Validação

Playwright reproduziu a ausência do estado de campo inválido e confirmou a correção em computador e celular. O percurso também verificou fechamento pelo fundo, cancelamento, foco de retorno, descarte de rascunho, remarcação, remoção e acesso. A checagem de tipos, o build, 257 testes do banco e o verificador de concorrência das quatro rotinas da Agenda passaram. O Atlas conferiu os diálogos e a guia Migração. [Galeria antes e depois](../../wireframes/comparacoes/v4.0.0-alpha.22-2026-11-19-paridade-eventos-tela-15-tela-16-tela-17/index.html)

## Limites e próximo passo

Autorrevisão do diff. A versão permanece local. Retomar a paridade 09, lista, proposta e participação em Acordos.
