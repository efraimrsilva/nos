# Organização do Núcleo — v3.6.2 — validado localmente

MVP02 e MVP05. Todos os casos abaixo estão **Não executados pelo usuário**. Executar em desktop e celular e registrar cada resultado/reteste em resultados.md. Automação local não altera esse status.

| ID | MVP / caminho | Pré-condição | Ação | Resultado esperado | Status |
|---|---|---|---|---|---|
| M02-ORG-001 | 02 / Início | Administrador associado | Abrir Início | Nome, propósito e informe de administração nessa ordem; lápis junto a cada campo | Não executado |
| M02-ORG-002 | 02 / Início → lápis do nome | Administrador | Alterar nome, confirmar e salvar | Só nome muda; propósito preservado; feedback no modal, sem recarregar documento; fechar retorna foco ao lápis | Não executado |
| M02-ORG-003 | 02 / Início → lápis do propósito | Administrador | Alterar propósito, confirmar e salvar | Só propósito muda; nome preservado; texto no cabeçalho atualizado; limites80/500 respeitados | Não executado |
| M02-ORG-004 | 02 / Início → Ver integrantes | Núcleo com várias pessoas | Abrir modal e nome para abrir detalhes | Lista completa, papéis e nomeações; ausência de e-mails/dados privados | Não executado |
| M05-ORG-001 | 05 / Integrantes → nome para abrir detalhes | Administrador e participante | Nomear; nomeado aceita/recusa; destituir quando permitido | Nomeação não administra antes do aceite; feedback permanece após mudança de controles; último administrador não pode ser destituído | Não executado |
| M05-ORG-002 | 05 / Integrantes → nome para abrir detalhes | Administrador e outro integrante | Remover com ciência | Participante perde acesso; histórico permanece; lista atualiza; pessoa comum não vê a ação | Não executado |
| M02-ORG-005 | 02 / Conta ou Mais → Gerenciar convites | Administrador | Abrir gestão; preparar/revogar convite descartável | Gestão existente preservada; navegação fecha menu anterior; não aceita convite por outra pessoa | Não executado |
| M02-ORG-006 | 02 / Seus Núcleos → Entrar com convite | Código válido descartável | Conferir código, adiar; depois conferir e aceitar | Adiar não associa; aceite explícito associa; atalho não existe na Conta | Não executado |
| M05-ORG-003 | 05 / Conta, popover ou Mais → Sair de um Núcleo | Participante com vínculo | Conferir avisos; cancelar; depois confirmar saída em dados descartáveis | Cancelar preserva vínculo; saída remove acesso, mantém conta/história; preferência de autoria explicada; acordos não são cancelados | Não executado |
| M05-ORG-004 | 05 / Conta, popover ou Mais → Encerrar Núcleo para todos | Administrador, Núcleo descartável | Nome incorreto; cancelar; depois nome correto e ciência | Erro não encerra; cancelar não altera; confirmação encerra acesso de todos e revoga convites, preservando contas/história; visual vermelho | Não executado |
| M05-ORG-005 | 05 / Saída ou encerramento | Pessoa com vários Núcleos | Trocar seleção depois de preencher confirmação | Nome de destino correto; confirmação anterior reiniciada; nenhuma gravação ao trocar | Não executado |
| M02-ORG-007 | 02 / Navegação desktop e mobile | Pessoa associada | Navegar, abrir/fechar modais por teclado e repetir com movimento reduzido | Sem guia Pessoas; mobile Início/Seus Núcleos/Acordos/Agenda/Mais; sem overflow; foco/feedback/estilo consistentes, animações reduzidas respeitadas | Não executado |
| M05-ORG-006 | 05 / Participante sem administração | Participante comum | Abrir Início, integrantes e Conta | Consulta integrantes e sai; não edita identidade, administra convites ou encerra o Núcleo | Não executado |
| M02-ORG-008 | 02 / Favorito antigo /pessoas | Pessoa associada; depois sem vínculo | Abrir URL antiga | Associado chega ao modal no Início; sem vínculo recebe bloqueio, sem dados de integrantes | Não executado |
