# Registro — v0.16.0 — 2026-10-14 — Imp. de contrato de saída com Fun. de continuidade do acordo

**Contrato vigente:** [administração e participação](../funcionalidades/administracao-participacao.md).

**Superado pelo modelo simples aprovado em 14/10/2026.** Preservado como histórico; não implementar as regras de cancelamento/votação por saída abaixo. Consulte [roteiro vigente](registro-v0.16.0-2026-10-14-10-imp-modelo-administracao-fun-roteiro-simplificado.md).


Status: histórico superado pelo contrato de administração e participação; não implementar estas regras.

Objetivo: definir efeito da saída de participante original sobre acordos em teste e ativos.

Resposta 6 vigente após correção do usuário:

- Acordo em teste: encerrar automaticamente o acordo original, preservando seu histórico. Os participantes que permanecerem poderão criar nova proposta, com novos aceites.
- Acordo ativo: não encerrar automaticamente pela saída. Abrir nova votação para decidir seguir em frente; mais da metade das pessoas com direito a voto precisa escolher continuar (floor(N/2)+1). Não reaproveitar votos anteriores como novos votos.
- A regra indicada explicitamente pelo usuário para essa continuidade é maioria absoluta; o limiar de um terço do contrato anterior para confirmação de testes acima de150 não foi aprovado para esta nova votação. Não alterar o contrato anterior por inferência.
- A primeira aprovação de encerrar teste e ativo foi corrigida pelo usuário antes da conclusão desta interação: somente teste encerra automaticamente. Preservar essa correção como decisão vigente.

Eleitorado aprovado na resposta7: somente participantes originais que permanecem associados ao Núcleo. Novos membros não votam nessa continuidade. [Registro da resposta7](registro-v0.16.0-2026-10-14-05-imp-contrato-saida-fun-eleitorado-continuidade.md).

Prazo/resultado aprovados na resposta8: sete dias desde abertura; maioria aprova imediatamente; prazo sem maioria encerra preservando história. [Registro](registro-v0.16.0-2026-10-14-06-imp-contrato-saida-fun-prazo-votacao.md). Resposta9 B permite registros durante votação e preserva-os após encerramento. [Registro](registro-v0.16.0-2026-10-14-07-imp-contrato-saida-fun-registros-durante-votacao.md). Resposta10: nova saída durante votação pendente abre nova rodada dos originais restantes, sete dias/novos votos, sem aproveitar a anterior. [Registro](registro-v0.16.0-2026-10-14-08-imp-contrato-saida-fun-reinicio-votacao.md). Pendente: menos de dois originais associados. Não presumir silêncio como aceite ou reduzir votos existentes para satisfazer maioria.

Arquivos: este registro, definição em andamento, contrato autonomia-protecao, estado e histórico. Integrações: nenhuma alterada. Validação: autorrevisão documental e git diff --check, sem testes funcionais repetidos. Decisão posterior à publicação30ea405, sem mudança de versão, commit, push ou deploy nesta interação.
