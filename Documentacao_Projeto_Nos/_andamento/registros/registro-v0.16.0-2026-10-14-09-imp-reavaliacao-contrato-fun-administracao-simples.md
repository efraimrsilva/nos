# Registro — v0.16.0 — 2026-10-14 — Imp. de reavaliação do contrato com Fun. de administração simples

Status: direção aprovada pelo usuário no quadro Situação/Comportamento; implementação pendente. Versão funcional preservada. [Roteiro simplificado vigente](registro-v0.16.0-2026-10-14-10-imp-modelo-administracao-fun-roteiro-simplificado.md).

Contexto: usuário apontou excesso de perguntas/regras/cancelamentos e propôs administração do Núcleo inspirada na ideia de administrador de grupo, com convites e entrada de pessoas, para facilitar o uso e remover as votações adicionais. A investigação confirmou que hoje o banco distingue apenas creator/member, e contratos de Hábitos fixam originais; simplificar exigirá alteração explícita dessas regras, não somente interface.

Direção confirmada: priorizar simplicidade; respostas5–10 de cancelamentos/votações por saída foram substituídas pelo modelo aprovado. Sequência anterior interrompida; pergunta11 não respondida e não retomada. Preservar registros históricos, sem implementá-los.

Base aprovada no quadro:

- Quem cria inicia como administrador; administração gerencia convites/participantes e organização dos acordos. Delegação e responsabilidades serão delimitadas em um único contrato curto.
- Saída revoga vínculo/acesso próprio e preserva atividades segundo a preferência de autoria já discutida; não cancela acordos nem abre votação de continuidade automaticamente.
- Acordos continuam com os participantes que permanecerem. Novos membros escolhem explicitamente participar, sem aceite automático ou acesso a dados fora de seu contexto autorizado.
- Administração do espaço não permite aceitar propostas por outra pessoa ou alterar conteúdo íntimo alheio. Aceite individual inicial permanece como proteção; reavaliar o ciclo atual de teste/confirmação/revisão para reduzir votações sem retirar autonomia.

Essa direção substitui as rodadas criadas por saídas nas respostas5–10; não presume que todas as regras existentes de consentimento foram abolidas. Encerramento/alteração de termos, saída do último administrador/membro e direitos serão consolidados pelo novo roteiro antes da implementação.

Arquivos: este registro, estado, histórico e referência na definição em andamento. Sem código, migração, nova versão, commit, push ou deploy. Validação: autorrevisão documental e git diff --check. O roteiro posterior foi respondido integralmente; próximo passo é implementar o contrato consolidado de administração/participação, sem retomar a bateria de perguntas sobre votações descartadas.
