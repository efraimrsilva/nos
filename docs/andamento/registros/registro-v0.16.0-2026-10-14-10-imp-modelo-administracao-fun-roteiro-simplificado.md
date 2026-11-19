# Registro — v0.16.0 — 2026-10-14 — Imp. de modelo de administração com Fun. de roteiro simplificado

**Referência consolidada:** [contrato aprovado](../funcionalidades/administracao-participacao.md), [registro das respostas](registro-v0.16.0-2026-10-14-11-imp-contrato-administracao-fun-respostas-consolidadas.md).

Status: oito respostas aprovadas e consolidadas; implementação pendente. Versão funcional preservada.

Objetivo: substituir a cascata de perguntas/votações por um contrato simples de administração e participação. Usuário aprovou o quadro Situação/Comportamento proposto e pediu reelaborar todas as perguntas antes de implementar.

Base aprovada:

- Quem cria inicia como administrador e pode nomear outro participante para administrar.
- Administrador gerencia convites e participantes; convidado aceita entrada explicitamente.
- Qualquer pessoa pode sair; saída revoga acesso próprio, mantendo histórico conforme preferência de autoria já definida.
- Saídas não cancelam acordos nem abrem votações automaticamente. Acordos continuam disponíveis para participantes que permanecem.
- Novos membros escolhem participar de acordos. Administração organiza acordos; não aceita em nome de outros nem altera conteúdo íntimo alheio.
- Preservar conteúdo/humor/notas; preferência geral de autoria pós-saída permanece. Item5 operacional adiado pelo impedimento do Google.

Respostas antigas5–10 sobre cancelamentos, encerramento de teste por saída e votação/reinício de continuidade estão substituídas por essa direção. Pergunta antiga11 não foi respondida e não será retomada. Resposta nova3 expressamente aprovada: substituir votações coletivas do ciclo dos acordos. Código anterior permanece até a implementação do contrato novo.

Novo roteiro concluído — oito respostas vigentes (14/10/2026):

1. Administração — permitir vários administradores com poderes equivalentes para convidar/revogar convites, remover participantes, ajustar nome/propósito e nomear/destituir administradores; novo administrador aceita o papel. Ações sensíveis pedem confirmação; papel não amplia leitura de dados pessoais.
2. Último administrador — sua saída não é bloqueada; sortear um dos participantes restantes e atribuir administração automaticamente. Resposta do usuário substitui a recomendação anterior de assunção voluntária. Se não restar ninguém, aplicar encerramento do Núcleo da resposta5.
3. Acordos — qualquer membro pode propor; administradores organizam, iniciam/concluem teste, ativam e encerram; cada pessoa aceita/recusa participar individualmente. Substituição das votações coletivas de teste/confirmação/revisão expressamente aprovada; não implementá-las no novo modelo.
4. Alteração de termos — administrador altera combinado com mudança visível e novo aceite individual para continuar na versão alterada, sem votação coletiva. Não tratar silêncio como concordância nem reutilizar aceite de termos anteriores.
5. Último participante — sua saída encerra o Núcleo e revoga convites; história fica preservada e sem acesso de ex-membros, sujeita à política de dados. Não oferecer reentrada com convite antigo; prazo de retenção/exclusão física exige política própria.
6. Preferência de autoria — configuração geral desativada inicialmente; aplicá-la a cada saída futura. Se ativada, autoria não é exibida; conteúdo permanece. Não alterar automaticamente saídas anteriores nem reidentificar contribuições já ocultadas.
7. Direitos sobre dados — no MVP, acesso/correção/exportação/exclusão solicitados pelo suporte, com verificação de titularidade e proteção de terceiros; sem prometer automação ou canal operacional antes de existir. Alertar na saída que o histórico de conversas/interações compartilhadas permanece. Tratamento do histórico, prazos e retenção serão explicitados no procedimento, sem inventar prazos nesta definição.
8. Suporte/responsabilidade — Sintagma Software; sintagmasoftware@gmail.com. Usar nos textos de Ajuda, suporte, termos e tratamento de dados. Contato definido não certifica atendimento/recebimento nem autoriza envio automático de mensagens.

As oito respostas foram recebidas; não retomar questionário sobre votações descartadas. Questões técnicas rotineiras de permissão, transação e interface serão resolvidas na implementação dentro do contrato aprovado, sem novas perguntas de baixo impacto.

Arquivos: este roteiro, registro de reavaliação/definição, contrato, estado/histórico e identificação dos registros superados. Sem código, migração, alteração funcional de versão, commit, push ou deploy. Validação documental: revisão de consistência e git diff --check. Próximo passo: implementação do contrato consolidado, com migração, permissões e testes; operação externa permanece adiada.
