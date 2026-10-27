# Processo permanente de testes manuais — v3.1.3

Criado em 2026-10-23 por solicitação do usuário.

## Regra de manutenção

Cada funcionalidade criada ou alterada deve ter ao menos um teste manual rastreável ao MVP ou Expansão do Atlas vivo, no mesmo conjunto lógico da entrega. Inclua caminho, pré-condição quando necessária, ação e resultado esperado; separe cenários positivos, negativos, permissões, persistência, acessibilidade e falhas quando relevantes. Não confunda representação offline do Atlas com integração executada. Revise Atlas, contratos e código antes de gerar ou atualizar a lista; divergências devem ser resolvidas por evidências e decisões vigentes.

Use uma linha por teste, iniciada por `[]`, com ID estável. Planejado não entra como funcionalidade concluída: registre etapa/expansão, contrato pendente e bloqueio de execução. Não invente resultados. Novos MVPs serão detalhados em partes conforme a sequência do Atlas; esta entrega detalha somente o MVP 01.

## Execução e resultados

O usuário executa e envia ID, resultado e observação. Ao receber, atualizar resultados.md e a continuidade no mesmo atendimento. Estados: Não executado, Aprovado, Falhou, Bloqueado e Não se aplica (sempre com justificativa). Cada execução/reteste tem linha própria; não apagar falha anterior nem aprovar todos os dispositivos com uma execução. Corrigir um bug não aprova automaticamente o reteste manual.

Formato de retorno: `M01-013 | Falhou | ambiente/navegador/dispositivo | observado | evidência opcional`. Se contexto faltar, registrar Não informado; se relato for ambíguo, pedir esclarecimento sem inventar aprovação. Nunca incluir senha, token, link completo de autenticação ou dados pessoais em evidências. Priorizar correção de bloqueios do acesso e exposição de dados.

## Índice

- [MVP 01 — 97 testes](mvp-01.md): confirmação com e sem login em M01-063 a M01-080; e-mails personalizados em M01-081 a M01-097. Modelos de fluxos futuros não significam funcionalidade ativada; conferir a aplicação no Supabase antes de testar recebimento real.
- [Resultados e histórico de execuções](resultados.md).
- MVP 02–05 e expansões: detalhamento futuro, sem afirmar cobertura já criada.
