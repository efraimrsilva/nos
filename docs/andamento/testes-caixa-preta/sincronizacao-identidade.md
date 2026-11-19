# Sincronização da identidade — v3.6.3

MVP02/MVP05; telas12/13/14/16/66/71/73. Todos os casos estão **Não executados pelo usuário**. Automação local não altera o status manual. Repetir em desktop e celular.

| ID | Caminho / pré-condição | Ação | Resultado esperado | Status |
|---|---|---|---|---|
| M02-SYNC-001 | Início13; administrador e integrante em sessões distintas do mesmo Núcleo | Administrador salva nome e depois propósito; integrante mantém a página aberta | Ambos os textos chegam automaticamente em poucos segundos, conforme rede/intervalo3s, sem F5; nome contextual e cartão acompanham; integrante continua sem lápis administrativo | Não executado |
| M02-SYNC-002 | Seus Núcleos12 aberto em outra sessão | Administrador muda nome | Cartão/ordenação exibem nome atual sem navegar ou recarregar documento | Não executado |
| M02-SYNC-003 | Acordos16/Agenda14 e Conta66/Mais71; vínculo existente | Manter rota ou seletor aberto enquanto outro administrador muda nome | Contexto do menu e nome do seletor recebem alteração; rota/modal permanecem | Não executado |
| M02-SYNC-004 | Integrantes73 aberto ou outro administrador digitando no modal de propósito | Outra sessão altera identidade | Modal permanece aberto; rascunho e confirmação preservados; nome atualizado no conteúdo compartilhado | Não executado |
| M02-SYNC-005 | Sessão receptora com conexão temporariamente interrompida ou aba oculta | Alterar nome em outra sessão; reconectar/voltar à aba | Dados anteriores mantidos durante interrupção; nova conferência ao reconectar/voltar, com atualização sem reload | Não executado |
| M02-SYNC-006 | Contas associadas a Núcleos distintos | Administrador altera apenas seu Núcleo | Outra conta não recebe identidade ou acesso ao Núcleo alheio; controles e autorização mantidos | Não executado |
