# MVP05 — Conta e perfil — v3.3.1

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
