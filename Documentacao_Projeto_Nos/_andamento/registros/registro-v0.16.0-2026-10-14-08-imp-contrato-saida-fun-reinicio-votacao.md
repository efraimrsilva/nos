# Registro — v0.16.0 — 2026-10-14 — Imp. de contrato de saída com Fun. de reinício de votação

**Contrato vigente:** [administração e participação](../funcionalidades/administracao-participacao.md).

**Superado pelo modelo simples aprovado em 14/10/2026.** Preservado como histórico; não implementar as regras de cancelamento/votação por saída abaixo. Consulte [roteiro vigente](registro-v0.16.0-2026-10-14-10-imp-modelo-administracao-fun-roteiro-simplificado.md).


Status: histórico superado pelo contrato de administração e participação; não implementar estas regras.

Resposta10: se outro participante original sair enquanto a votação de continuidade estiver pendente, encerrar aquela rodada sem decidir a continuidade e abrir nova rodada para os originais restantes, com sete dias e novos votos. Votos anteriores ficam preservados como história da rodada, sem reaproveitamento na nova decisão e sem alterar suas regras de privacidade. Novos registros de momentos continuam permitidos conforme resposta9.

Não reduzir o denominador de uma rodada existente para aprová-la com votos anteriores. Repetição da mesma saída não representa outra saída real; detalhes de idempotência e concorrência serão técnicos na implementação.

Próxima pergunta: se restarem menos de duas pessoas originais associadas, encerrar acordo ativo preservando histórico sem votação? Essa exceção para grupo insuficiente ainda não foi aprovada. Depois definir criador/transferência/último membro e demais contratos.

Arquivos: este registro, registros de continuidade/definição, contrato, estado e histórico. Sem alteração de integração, código, versão, commit, push ou deploy. Validação: autorrevisão documental e git diff --check; não repetir testes funcionais nesta definição documental.
