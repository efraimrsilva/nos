# Testes manuais — Aparência da conta — v3.2.1

MVP05 · Tela66 e navegação compartilhada. Todos os casos abaixo estão **Não executados manualmente**. A aprovação automatizada registrada no contrato não aprova estes testes do usuário.

Pré-condição: usar a versão3.2.1 em ambiente com sessão válida; para falhas, usar conta de teste. Não enviar credenciais nos resultados.

| Caso | Caminho e ação | Esperado |
| --- | --- | --- |
| [] M05-TEM-001 | Celular → Mais → Aparência | Uma única opção agrupa nove temas; seletor cabe na largura, com rolagem vertical quando necessária. |
| [] M05-TEM-002 | Computador → navegação lateral → Aparência | Mesmo seletor; opções legíveis, com nome, prévia e indicação da escolha. |
| [] M05-TEM-003 | Configurações → Aparência | Abre a mesma preferência da conta. |
| [] M05-TEM-004 | Selecionar cada um dos nove temas | Cores mudam imediatamente; salvamento confirmado; nenhum botão Salvar obrigatório. |
| [] M05-TEM-005 | Selecionar Preto → fechar seletor | Fundo principal preto; painéis e campos distinguíveis; textos e avisos legíveis. |
| [] M05-TEM-006 | Salvar tema → recarregar → sair/entrar → entrar em outro dispositivo | Preferência recuperada da conta; nenhum flash visual do tema claro na área interna após carregamento da página. |
| [] M05-TEM-007 | Tema salvo → abrir boas-vindas e telas públicas da Conta/login | Aparência original clara; ao retornar à área interna, preferência preservada. |
| [] M05-TEM-008 | Conta de teste A escolhe tema → sair → entrar em B | B recebe sua própria preferência/padrão, sem herdar a de A. |
| [] M05-TEM-009 | Seletor aberto → simular falha de conexão → escolher tema | Prévia aplicada, erro sem mensagem falsa de sucesso; ao restabelecer, Tentar salvar novamente confirma gravação. |
| [] M05-TEM-010 | Alternar rapidamente entre três temas → aguardar confirmação → recarregar | Última escolha permanece. |
| [] M05-TEM-011 | Em cada tema, navegar entre áreas no computador/celular | Área atual recebe cor própria, peso e marcador; Mais fica ativo em Configurações/Conta e áreas fora da barra. |
| [] M05-TEM-012 | Usar Tab, setas nos temas e Escape; habilitar movimento reduzido | Foco visível, seleção por teclado, diálogo fecha e devolve foco; movimento reduzido respeitado. |
| [] M05-TEM-013 | Conta de teste → consultar sucesso/erro e ação de revogar convite, sem confirmar revogação | Contraste legível nos nove temas; ação destrutiva permanece identificável. |

| [] M05-TEM-014 | Computador e Mais no celular → comparar Aparência com Preferências e ajuda | Mesmo alinhamento à esquerda, cor, fonte, espaçamento e fundo; foco visível ao usar teclado. |
| [] M05-TEM-015 | Escolher Solar/Âmbar e Noturno/Neon → recarregar | Novas paletas distintas; preferência recuperada e boas-vindas/login permanecem claros. |
| [] M05-TEM-016 | Em cada tema, conferir ícones de navegação, Agenda, Pessoas/convites e exclusão | Cores originais preservadas, inclusive no item ativo; localização continua destacada por texto/fundo/faixa. |

Enviar resultado por ID, ambiente, observado e evidência opcional conforme [processo](README.md). Não apagar falhas anteriores: cada reteste tem registro próprio.
