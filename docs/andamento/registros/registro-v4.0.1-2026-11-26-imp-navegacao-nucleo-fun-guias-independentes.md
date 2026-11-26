# Registro — v4.0.1 — 2026-11-26 — Imp. da navegação do Núcleo com Fun. de guias independentes

**Versão** 4.0.1

**Status** Concluída e validada localmente.

## Objetivo e contexto

Consolidar a navegação das prévias em Nossa Árvore, Memórias, Conexões, Nosso manifesto e Ponte do Nós. A lateral e a barra móvel oferecem as cinco guias. A faixa secundária e seus separadores deixam de aparecer. O Atlas vivo e seus capítulos espelham a divisão.

## Decisões e integrações

- Conexões conserva seleção de pessoa e temas e o diálogo Perfil de exemplo. O gatilho é Explorar perfil em detalhe. O diálogo apresenta exemplos fictícios a um membro autorizado e retorna à seleção ao fechar por X, Escape ou gesto externo. A ficha 49 mantém seu identificador e representa o contexto de Conexões. O endereço legado /perfis redireciona no mesmo Núcleo, preservando parâmetros e fragmento.
- As prévias reaproveitam o roteador Angular e a consulta de vínculo existente. Estados de carregamento, erro, sessão e falta de vínculo seguem o componente compartilhado. O rascunho da Ponte continua descartado ao trocar de rota. O Atlas usa a mesma composição para fichas, Visão global e etapas do MVP.
- A barra móvel rola horizontalmente para preservar a área de toque. A guia atual aparece ao seguir um link direto ou voltar pelo histórico.
- O ajuste é compatível com endereços anteriores e recebe incremento de correção. A verificação de alternativas apontou que Angular Router, os estilos locais e os ícones do projeto já atendem ao recorte. Context7 retornou a documentação corrente do roteador porque a versão 22 não estava indexada. O redirecionamento segue o padrão existente confirmado pelos tipos instalados.

## Arquivos

- `apps/web/src/app/` — estrutura, links, rotas, prévias e estilos. As regras visuais das prévias foram distribuídas em três folhas mantendo a ordem. A compilação de produção bloqueava a folha original acima do limite de 8 kB, e o limite foi preservado.
- `docs/wireframes/atlas/` — navegação, capítulos, fichas 38, 40, 44, 49, 55 e 61/62, Visão global e percursos.
- `tests/angular/nuclei.spec.mjs` — cenário existente atualizado para exercitar os novos destinos, o redirecionamento e as garantias de acesso.
- Manifestos, arquivos de trava, contrato de navegação, MVP, guia, histórico, estado e Brag document sincronizados.

## Validação e resultado

- `npm run typecheck` e `npm run build` aprovados. O build manteve avisos acima de 4 kB em quatro folhas, abaixo do limite de erro.
- Playwright com Chrome instalado, Supabase local e contas descartáveis. Dois cenários aprovados, em 1440 e 390 px. O cenário verifica cinco rotas, seleção, histórico, descarte do rascunho, redirecionamento de `/perfis`, proteção contra conta sem vínculo, fechamento externo de detalhe de memória e Escape no perfil fictício. A edição do teste corrigiu o seletor preexistente que encontrava a mesma data na lateral e no diálogo fechado. A asserção de acesso direto a Memórias falhou nas duas larguras antes da implementação.
- Verificadores do Atlas para Visão global, MVP e Migração aprovados. Conferência adicional do título de cada guia, seleção e correspondência da ficha 49 com Conexões em duas larguras. As 73 fichas foram preservadas.
- Autorrevisão com `git diff --check`, conferência dos arquivos de trava de dependências, versões e links da [galeria](../../wireframes/comparacoes/v4.0.1-2026-11-26-guias-nucleo-tela-38-tela-40-tela-44-tela-49-tela-55-tela-61/index.html).

## Limites e próximo passo

Recorte local com publicação pendente. As cinco áreas continuam prévias protegidas e os dados são ilustrativos. O planejamento de Nx e automação segue na fase 2. Próximo passo desta unidade é o commit atômico quando autorizado.
