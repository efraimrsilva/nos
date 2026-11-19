# Registro — v4.0.0-alpha.2 — 2026-11-15 — Imp. da interface compartilhada com Fun. de navegação Angular

**Status:** A02 validada localmente em `codex/migracao-angular`. Base A01 `50fd490` confirmada no GitHub. Linha Next.js em v3.11.1.

**Objetivo e contexto:** portar a estrutura compartilhada para a prévia Angular e manter o cabeçalho e os menus montados ao alternar de rota. Cobrir desktop, celular, histórico, foco, carregamento, falha e endereço desconhecido. A Tela 66 é a referência visual. Início em `/` é provisório até A03.

**Decisões e integração:** Angular Router e CSS (folhas de estilo em cascata) são suficientes para a estrutura da prévia. Angular Material ou CDK acrescentariam biblioteca para recursos que o diálogo HTML nativo e o roteador já fornecem. O layout usa as fontes Arial e Georgia e as cores da linha Next.js. Somente Início e Minha conta estão no menu. O componente da Conta é carregado sob demanda e compartilha a inicialização do Supabase se a pessoa sair da rota e voltar durante uma conexão lenta. A rota de endereço desconhecido mostra uma página 404 no cliente. O tratamento de código HTTP (protocolo de transferência de hipertexto) da hospedagem será ensaiado em A12.

**Modais:** Dados da conta continua disponível com sessão autenticada. O botão Mais da barra móvel abre Todos os seus caminhos. X, Escape e gesto externo fecham o diálogo superior. Padding e arraste iniciado dentro são preservados. Ao fechar por toque, o clique permanece no diálogo e não aciona a navegação de fundo. Voltar e Avançar acompanham o título da rota. Selecionar um destino diferente pelo menu leva o foco ao conteúdo.

**Arquivos:** `apps/web/src/app/app.*`, `app.routes.ts`, `preview-home.ts`, `shared/route-state.ts`, `shared/dialog-backdrop-dismiss.ts`, Conta e serviço de perfil.  `tests/angular/navigation.spec.mjs` cobre a estrutura e as interações. Atlas, contrato e galeria registram a versão.

**Validações:** tipos e builds Angular e Next.js aprovados. Playwright com Chromium em desktop 1440 px e celular emulado 390 px. Sete verificações A02 e seis de regressão A01 passaram. Um caso específico do menu móvel foi ignorado no desktop. Revisão independente conferiu o clique de fundo e a falha de carregamento retida no documento, além de apontar ajustes de foco e estado de rota. A inspeção confirmou ausência de estouro horizontal e indicadores de foco. Nenhum roteiro de caixa preta foi criado. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.2-2026-11-15-angular-interface-tela-66/index.html).

**Limites e próximo passo:** o menu mostra os destinos disponíveis na prévia. Núcleos, perfil global, login de produto, aparência e suporte entram nas etapas próprias. A03 porta Conta, sessão, confirmações, recuperação e retornos do Supabase. [Plano](../planos/migracao-angular.md).
