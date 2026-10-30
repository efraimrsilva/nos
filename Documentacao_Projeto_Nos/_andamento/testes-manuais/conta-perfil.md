# MVP05 — Conta e perfil — v3.4.0

Todos os casos abaixo estão **Não executados pelo usuário**. Automação local é evidência separada no registro da entrega. Usar conta de teste; não confirmar exclusão de conta pessoal.

| ID | Caminho e pré-condição | Ação | Resultado esperado |
|---|---|---|---|
| [] M05-PER-001 | Desktop, sessão e Núcleo A aberto | Abrir o círculo do perfil | Painel flutuante com seis seções, sem Notificações e Apagar minha conta; URL e Núcleo preservados. |
| [] M05-PER-002 | Painel aberto | Abrir Dados da conta; fechar com Escape; fechar painel | Modal retorna ao painel; Escape fecha painel e devolve foco ao perfil. Clique fora e botão Fechar também encerram o painel. |
| [] M05-PER-003 | Núcleo A, depois `/conta` | Recarregar; usar Início; abrir Núcleo B e voltar à conta | Retorno ao último Núcleo selecionado; trocar para outra conta não herda a seleção de A. Após sair ou ser removido do Núcleo, recarregar a conta não restaura seus atalhos. |
| [] M05-PER-004 | Página `/conta`, computador e celular | Consultar seções e Entrar e recuperar | Oito blocos; Conta e segurança ausente; Notificações sinalizada como planejada. Entrada suave; movimento reduzido desliga animações. |
| [] M05-PER-005 | Página `/conta`, conta descartável | Abrir Apagar minha conta e cancelar | Avisos e confirmação por escrito preservados; botão definitivo desabilitado sem APAGAR CONTA; cancelar mantém a conta. |
| [] M05-PER-006 | Perfil desktop ou página de conta mobile | Abrir Aparência, escolher tema e recarregar | Nove opções; aplicação imediata e sucesso apenas após salvar; preferência recuperada. Em erro, mensagem e reenvio sem sucesso falso. |
| [] M05-PER-007 | Área autenticada, desktop e celular | Conferir topo e navegação | Lupa e modal de busca do topo ausentes; notificações e perfil continuam acessíveis; filtro de Acordos preservado. |
| [] M05-PER-008 | Celular, sessão ativa | Tocar perfil; abrir e cancelar modais | Página completa da conta, sem painel desktop ou transbordamento horizontal; retorno e Núcleo preservados. |

Enviar resultados por ID, ambiente, observado e evidência opcional, conforme o processo permanente.

## Edição do nome — MVP05 — v3.4.0

| ID | Caminho e pré-condição | Ação | Resultado esperado | Situação |
|---|---|---|---|---|
| M05-PER-010 | /conta → Perfil → Dados da conta, sessão de teste, desktop/celular | Lápis ao lado do nome; alterar e Salvar nome; recarregar | Foco no campo; confirma após gravação; nome/iniciais atualizados e persistentes; e-mail/tema preservados | Não executado pelo usuário |
| M05-PER-011 | Perfil desktop → Dados da conta, sessão ativa | Lápis; alterar; Cancelar. Repetir fechando com Escape antes de enviar | Não grava; ao reabrir mantém nome anterior e retorna foco ao gatilho | Não executado pelo usuário |
| M05-PER-012 | Dados da conta, edição aberta | Informar espaços; tentar salvar; depois nome válido. Simular indisponibilidade de rede e reenviar | Inválido não grava; falha mantém rascunho sem sucesso falso; nova tentativa disponível | Não executado pelo usuário |
| M05-PER-013 | Duas abas com conta descartável A; abrir edição em uma | Trocar a sessão para conta B na outra aba e tentar salvar pelo formulário antigo | Operação recusada; não altera B; orienta atualizar/entrar novamente | Não executado pelo usuário |

## v3.3.3 — atalho de convite

[] M05-PER-009 | Não executado | MVP05/integração MVP02, sessão válida. Abrir perfil desktop → Conta e Núcleos → Entrar com convite. Repetir na página Conta, Preferências e Ajuda em desktop e celular. Esperado: abre /comecar/convite; painel de perfil fecha; nenhuma associação ocorre sem conferir e aceitar o convite.

## v3.4.2 — barra lateral

[] M05-PER-014 | Não executado | MVP05/integração MVP02, sessão com Núcleo ativo | Abrir Início e Conta em desktop: cartão com nome/Seu espaço compartilhado ausente, nome continua no cabeçalho; ocultar/mostrar barra e usar Seus Núcleos. Repetir acesso à lista via Mais no celular. Esperado: lista abre /nucleos e contexto não muda apenas por remover o cartão.
