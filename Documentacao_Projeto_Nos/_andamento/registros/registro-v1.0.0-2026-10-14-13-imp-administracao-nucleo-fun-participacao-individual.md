# Registro — v1.0.0 — 2026-10-14 — Imp. de administração do Núcleo com Fun. de participação individual

Status: implementação funcional concluída, revisada e validada localmente. Base main/9153223. DOCS_DIR: Documentacao_Projeto_Nos.

Objetivo: executar as oito decisões aprovadas e substituir votações coletivas por administração compartilhada e participação individual.

Contexto: a entrega anterior só oferecia orientação de saída. O contrato foi consolidado e publicado documentalmente; esta entrega implementa as mutações, a autorização no banco e as telas.

Requisitos e decisões: administradores equivalentes; nomeação comum aceita; sorteio atômico ao sair o último administrador; fechamento do último membro/revogação de convites; preservação do histórico; preferência de ocultar autoria aplicada somente às próximas saídas; novos termos exigem novo aceite. Publicar proposta não aceita por ninguém. Reentrada não restaura participação anterior. Salvar termos idênticos não redefine consentimento. Histórico anterior permanece somente para consulta, sem funções antigas de votação acessíveis.

Arquivos e integrações: nova migração/testes em supabase; controles/actions e action-form; pessoas, sair, privacidade, ajuda, conta; hub/detalhe/registrar/confirmar/revisar; ações administrativas dos acordos; convites e agenda; retorno seguro de autenticação; Atlas/MVP/Visão global/fichas/verificadores. Sem dependência nova. Os cinco testes SQL substituídos foram preservados em supabase/tests-legacy.

Validações:81 testes SQL oficiais (68 administrativos +13 convites); oito migrações atuais aplicadas do zero em banco descartável e68 administrativos aprovados;106 testes gerais no servidor de produção local;81 autenticados aprovados e um dispensado por cobertura das duas larguras no mesmo verificador. Tipos e build webpack aprovados em cópia C. Seis verificadores Atlas e fidelidade de73 telas/365 estados aprovados. Diff e revisão independente aprovados após corrigir reentrada, no-op de termos, categoria e presença própria com autoria oculta. Cinco testes SQL históricos movidos com blobs idênticos ao HEAD. Nenhuma operação remota.

Limitações: SMTP e prova operacional dependentes do Google adiados. Termos/política de dados completos, retenção/rotina de atendimento, dispositivos, alteração de e-mail e demais módulos futuros continuam reservados. Contato informado não comprova atendimento executado. Não houve commit/push/deploy desta implementação.

Próximos passos: publicar o commit atômico quando autorizado para este conjunto; aplicar a migração no ambiente de uso junto do código; concluir termos/política/procedimentos e operação após liberação do Google. Não usar somente o novo aplicativo contra o banco antigo.

Versão MAJOR1.0.0 pela substituição incompatível do ciclo e das permissões, conforme regra do usuário; não significa piloto liberado nem certificação de estabilidade operacional. [Testes de caixa preta](../funcionalidades/administracao-caixa-preta.md), [galeria](../../wireframes/comparacoes/v1.0.0-2026-10-14-mvp-05-administracao/index.html). Galeria80 capturas:26 antes Atlas real9153223,28 depois,26 aplicativo temporário.

Fechamento local: seis testes finais dos controles aprovados na versão1.0.0; tipos reconferidos com configuração do repositório e135 arquivos idênticos por SHA-256 na cópia de validação. Apenas o startup de Playwright foi adaptado na cópia para produção webpack. Zero contas temporárias das suítes routing/administration/member/cycle/proposal/controls após limpeza. A suíte geral foi executada pela CLI do Playwright (equivalente ao script test) porque o shim npm da cópia retornou código1 sem diagnóstico; CLI direta aprovou106 testes. Sem alteração de gerenciador ou dependências do projeto.
Supabase local encerrado ao concluir, backup=true confirmado. Histórico da migração local sincronizado; produção não alterada.

Publicação Git autorizada em15/10/2026 e inclusão desta unidade conferida no objeto inicial3c71eb584952d52dee5172a88127c6823fa88a51. [Registro de publicação](registro-v1.0.0-2026-10-15-imp-publicacao-git-fun-administracao-participacao.md). Não implica deploy, operação de e-mail ou migração remota.
