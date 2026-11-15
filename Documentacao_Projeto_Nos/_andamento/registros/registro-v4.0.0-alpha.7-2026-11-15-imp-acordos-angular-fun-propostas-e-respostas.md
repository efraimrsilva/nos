# Registro — v4.0.0-alpha.7 — 2026-11-15 — Imp. de Acordos no Angular com Fun. de propostas e respostas

**Status.** A07 na prévia local da branch `codex/migracao-angular`. Base A06 confirmada remotamente em `65e4ded`. Next.js v3.11.1.

**Objetivo e requisitos.** Portar Acordos, criação com conferência local, contagens compartilhadas, participação individual e o primeiro recorte do detalhe. Preservar paginação e leitura do legado, inclusive acordos encerrados.

**Decisões e integração.** Reutilizados Angular Router, validadores de proposta, regra de agrupamento e cliente Supabase do projeto. O banco confere vínculo, versão e situação via funções existentes. Publicar mantém a proposta pendente para todas as pessoas. A confirmação de recusa usa a versão lida. A leitura retorna apenas a própria resposta e totais da página. O detalhe aberto reconfere versão, estado e resposta própria junto à atualização das contagens em aba visível. Falha temporária conserva a última leitura e permite conferência posterior. A invalidação após responder usa a conta e o Núcleo, mesmo se a pessoa trocar o acordo selecionado durante a resposta.

**Arquivos e telas.** `apps/web/src/app/agreements/`, rotas do Angular, atalhos no Início, testes Playwright, Atlas e documentação. Telas 18, 22, 23, 24 e 36. A lista móvel preserva ordem única. Computador oferece Kanban e Painéis.

**Modais.** Nova proposta abre para quem tem vínculo e tem conferência local. O cartão abre os termos. A recusa pede confirmação com a versão lida. Enviar convite reutiliza A05 para a administração. Nossa Essência é um esboço. X, Escape e gesto externo fecham a camada superior. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.7-2026-11-15-angular-acordos-tela_18-tela_22-tela_23-tela_24-tela_36/index.html).

**Validações.** `npm run test:angular` aprovou 27 testes e ignorou no computador um caso exclusivo de celular. Duas contas em computador e celular emulado conferiram criação, ausência de aceite implícito, recusa, revisão em outra sessão, leitura legada, isolamento e resposta de envio perdida. `npm run test:db` aprovou 89 verificações pgTAP de contagens, compatibilidade de Hábito e administração. Tipos e builds de Angular e Next.js aprovados. Os verificadores de percurso, modelo de Hábito, Migração, MVP e Visão global do Atlas passaram. A galeria de 34 imagens foi conferida em duas larguras.

**Revisão.** A revisão independente apontou atualização de termos, invalidação ao trocar a seleção e ordenação móvel. As três foram ajustadas. A regressão da troca de seleção retarda a resposta do banco enquanto outro acordo fica selecionado e confere a resposta própria ao voltar.

**Limites.** O formulário bloqueia reenvio quando não recebe confirmação. Requisições de criação independentes continuam distintas. A pessoa pode conferir a lista antes de enviar de novo. O detalhe cobre os termos e a participação nesta entrega. Ciclo de Hábito, momentos, revisão pela interface e histórico entram na A08. Sem dependências novas, migração de esquema, roteiro de caixa preta ou publicação.

**Próximo passo.** A08, ciclo de Hábito. [Plano](../planos/migracao-angular.md).
