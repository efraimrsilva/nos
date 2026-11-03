# Fechamento externo de modais — v3.6.1

MVP01/MVP05, regra transversal para todos os modais. Casos abaixo **Não executados pelo usuário**. Automação não registra aprovação manual.

| ID | Caminho / pré-condição | Ação | Resultado esperado | Status |
|---|---|---|---|---|
| M05-MOD-001 | Conta → recuperação; desktop e celular | Clicar/tocar fora da caixa | Fecha e devolve foco ao gatilho, sem enviar formulário | Não executado |
| M05-MOD-002 | Qualquer modal aberto | Clicar no conteúdo e no padding; arrastar seleção de dentro para fora | Permanece aberto; conteúdo não é confundido com backdrop | Não executado |
| M05-MOD-003 | Mais → modal de recuperação | Tocar fora do modal interno e depois fora de Mais | Primeiro fecha só a camada superior, depois o menu | Não executado |
| M05-MOD-004 | Notificações, exclusão, identidade e integrantes | Abrir/fechar por fora, X e Escape; repetir com movimento reduzido | Mesmo cancelamento/foco de cada formulário; fechar não confirma ação destrutiva; sem piscada na abertura inicial | Não executado |
| M05-MOD-005 | Novo modal implementado futuramente | Abrir e clicar fora | Recebe a regra global automaticamente; conferir ao criar qualquer modal | Não executado |
