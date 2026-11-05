# Registro — v3.7.1 — 2026-11-05 — Imp. de cabeçalho com Fun. de preferências

**Versão:** 3.7.1 (PATCH). **Status:** concluído e validado localmente. **Base:** main, e242ef3.

## Objetivo e escopo

Simplificar o cabeçalho e a Conta autenticada, identificar a Agenda em desenvolvimento e transformar o sino em painel suspenso. A revisão de escopo solicitada em 05/11 restaurou o gatilho “Enviar convite” em Acordos.

- **Relatar um problema:** texto “Em último caso, o e-mail da conta poderá ser usado para contato.” O modal existente continua com os mesmos gatilhos e dados técnicos.
- **Conta e Aparência:** retirar o rodapé autenticado e o parágrafo de Aparência. O gatilho exibe “Escolha as cores do seu espaço”. O rodapé público permanece.
- **Agenda:** ícone de esboço e descrição acessível na navegação. Usa o mesmo cartão de aviso de Árvore e memórias, com texto específico para o calendário interno ativo e as expansões planejadas.
- **Cabeçalho:** ícones de relato e sino centralizados no mesmo eixo. O painel suspenso do sino usa o mecanismo nativo do navegador, com Escape, X, clique fora e fechamento na navegação. Consulta Acordos ou Seus Núcleos de acordo com o contexto. O painel é acessível a usuários autenticados e apresenta o esboço da central.

## Implementação e integração

ApplicationShell integra NotificationsPopover e o atalho ProblemReport. AccountPreferences e ThemePicker ajustam textos. A página Agenda e FuturePreview reutilizam FeatureSketchNotice e seu estilo responsivo. O Atlas espelha os atalhos, avisos e composição com dados de exemplo. Sem dependência, migração ou mudança no contrato de persistência.

**Modais afetados:** Relatar um problema continua um modal real de suporte para conta autenticada. Fecha por X, Escape ou clique fora, sem enviar. A confirmação de envio depende da ação no servidor. O antigo modal do sino foi substituído pelo painel não modal. O cartão “No seu tempo” no Início e o seletor de Aparência conservam seus diálogos.

## Validação

As capturas anteriores em Chromium foram feitas antes das alterações, com 3.7.0. O teste do painel falhou no estado anterior conforme esperado. A primeira suíte intermediária aprovou 16 casos e detectou desalinhamento de 4 px nos dois casos novos. A causa foi a segunda linha da grade do sino, criada por um elemento vazio. A reprodução isolada confirmou centros iguais após sua remoção. A revisão independente apontou o anúncio dos esboços para leitores de tela. A correção com descrição acessível foi conferida pelo revisor.

npm run typecheck e npm run build aprovados. O reteste final aprovou os oito casos autenticados de cabeçalho, paridade responsiva e fechamento por fora (desktop e celular). No reteste intermediário, o caso móvel identificou extrapolação horizontal de 37 px. O ajuste manteve margem lateral de 12 px e o reteste final confirmou o painel no viewport. Atlas validado pelos verificadores de cabeçalho, relato e Visão global (73 composições). Diff sem erros de espaços.

## Evidências e próximo passo

[Galeria antes/depois](../../wireframes/comparacoes/v3.7.1-2026-11-05-cabecalho-preferencias-tela_13-tela_14-tela_60-tela_66/index.html) · [Roteiro manual](../testes-caixa-preta/cabecalho-preferencias-v3-7-1.md).

Ambiente local e Chromium com emulação móvel. A imagem anterior da Agenda em celular registra carregamento. A composição anterior do conteúdo está na captura do Atlas. Uma tentativa de recaptura isolada foi interrompida ao não localizar a configuração do banco local na cópia temporária. O usuário limitou o trabalho às verificações já iniciadas. Casos manuais permanecem Não executados. Próximo passo: conferir o roteiro manual em desktop e celular. Commit e publicação dependem de autorização.
