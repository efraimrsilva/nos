# Testes de caixa preta — totais da navegação — v3.3.0

Escopo transversal: MVP02 (Núcleos/Pessoas), MVP03 (Acordos), MVP04 (Agenda). Executar em desktop e celular, registrando ambiente e versão em [resultados](resultados.md). Todos os casos começam **Não executados manualmente**; automação local/online não equivale a aceite manual.

[] NAV-001 | MVP 02 | Abrir Seus Núcleos com mais de um vínculo atual | Esperado: total geral correto, sem convites pendentes ou Núcleos fechados.
[] NAV-002 | MVP 02 | Abrir um Núcleo no desktop e observar os quatro links | Esperado: números discretos à direita, sem círculo, cor de alerta ou sobreposição no ícone.
[] NAV-003 | MVP 02 | Abrir no celular e tocar Mais | Esperado: totais junto aos rótulos; Seus Núcleos com total no Mais; links e fechamento funcionam.
[] NAV-004 | MVP 03 | Aceitar acordo e atualizar; depois revisar os termos e atualizar | Esperado: aceite vigente entra no total; aceite antigo deixa de contar até novo aceite.
[] NAV-005 | MVP 03 | Encerrar um acordo aceito e voltar à navegação | Esperado: deixa de contar; histórico permanece disponível.
[] NAV-006 | MVP 04 | Incluir a pessoa em compromisso futuro com resposta pendente, aceitar e depois recusar | Esperado: pendente/aceito contam uma vez; recusado deixa de contar.
[] NAV-007 | MVP 04 | Atualizar depois do término de um compromisso | Esperado: compromisso terminado não conta; compromisso em andamento conta.
[] NAV-008 | MVP 02 | Compartilhar dois Núcleos com a mesma pessoa | Esperado: Pessoas conta a outra pessoa uma vez e exclui a própria conta.
[] NAV-009 | MVP 02 | Sair de um Núcleo e retornar a Seus Núcleos | Esperado: totais refletem os vínculos restantes, sem apagar histórico.
[] NAV-010 | MVP 02 | Abrir uma conta sem Núcleos | Esperado: zero real em Núcleos, sem números simulados.
[] NAV-011 | MVP 02 | Conferir navegação por teclado/leitor de tela e celular de 320 px | Esperado: descrição informa alcance geral; total exato acessível; sem corte ou sobreposição.
[] NAV-012 | MVP 02 | Conferir tema claro e escuro, alternar de conta e atualizar | Esperado: texto legível, ícones preservados e totais próprios de cada conta.

Falha da função é coberta por teste automatizado no banco local. Não provocar indisponibilidade no ambiente de produção para reproduzir um teste de caixa preta.
