# Migração integral para o Layout atual — v2.0.0

> Execução autorizada em 18/10/2026. Skills: brainstorming, writing-plans, subagent-driven-development, revisão e verificação. Sem commit, push, deploy ou migração remota.

**Objetivo:** substituir a apresentação antiga em todas as rotas pelo desenho de `Telas/Layout novo`, mantendo ações, permissões, links e dados reais. Módulos futuros recebem esboços explícitos, sem persistência.

**Referência e arquitetura:** `Telas/Layout novo/index.html`, `app.js` e `styles.css` são o desenho indicado pelo usuário e prevalecem sobre a composição anterior do Atlas. A estrutura compartilhada recebe componentes de servidor como conteúdo; apenas navegação e interações visuais executam no navegador. Next.js 16.3.6, React 19.3, Tailwind 4, Lucide e Supabase existentes, sem trocar dependências.

**Restrições:** conservar validação de sessão e vínculo nas páginas e ações; nenhum progresso individual pode ser inferido de categorias antigas; funções não desenvolvidas levam sinalização visível; animações respeitam movimento reduzido; não restaurar arquivos que o usuário reorganizou; preservar galerias históricas. Branch `codex/novo-layout`, base `de44ca8`. Execução no checkout compartilhado para preservar os protótipos ainda não rastreados.

## Entregas e critérios

- [x] Estrutura: `src/shared/components/application-shell.tsx`, navegação lateral/inferior acessível, título contextual, rodapé; `OnboardingShell` encaminha consumidores à nova estrutura. Estilos em `src/app/globals.css` e `src/app/layout-system.css`. Testar entrada, teclado, 390/768/1440 px e movimento reduzido.
- [x] Páginas reais: Núcleos, Início, agenda, pessoas, convites e controles recebem hierarquia, painéis e ícones do novo layout. Manter textos de ações e contratos dos formulários. Conferir fluxos autenticados existentes.
- [x] Acordos: Kanban e painéis/lista com propostas reais, filtros, detalhes, participação, registro, revisão e gestão preservados. Fluxo futuro separado e identificado. Testar troca de visualização e envio/participação/gestão existentes.
- [x] Futuro: Árvore, memórias, conexões/perfis e manifesto/cuidado com composições próprias e acesso protegido. Demonstrações sempre rotuladas como esboço, sem criar registros ou fingir integração.
- [x] Atlas: atualizar referência visual vigente, conservar fichas e inventário, sincronizar navegação/status/cobertura/roteiro e acrescentar galeria datada. Corrigir referências à origem reorganizada sem restaurar arquivos removidos.
- [x] Verificação e fechamento: testes pertinentes, tipos, build, revisão do diff e revisão independente; atualizar versão somente após aprovação das verificações, estado, histórico, Brag e registro. Registrar limites reais de ambiente e próximo passo.

## Interfaces entre tarefas

| Produtor | Consumidor | Contrato |
| --- | --- | --- |
| Estrutura | Todas as páginas | `OnboardingShell({children, showTree?, nucleusName?})`, sem duplicar menus |
| Estilos | Páginas | Classes `layout-page`, `page-heading`, `eyebrow`, `surface-panel`, `feature-grid`, `color-icon`, `primary-action`, `secondary-action`, `prototype-notice` |
| Páginas reais | Navegação | Rotas existentes preservadas; links futuros sob `/nucleos/[id]` |
| Futuro | Auth | Mesmo vínculo obrigatório, sem operações de escrita |
| Acordos | Futuro | Categorias antigas não comprovam as passagens individuais |

## Registro de execução

Decisão: referência visual e escopo já fornecidos e autorizados pelo usuário; executar as decisões reversíveis sem nova rodada de aprovação. Nenhuma escolha de critérios de progressão ou contrato de banco será inventada.

Decisão: manter trabalho neste checkout em uma branch própria; mudanças preexistentes são a reorganização dos protótipos. Criar outra cópia perderia a referência não rastreada e dificultaria a revisão local.

Pré-revisão: tarefas compartilham apenas a interface `OnboardingShell` e classes acima; escrita de estilos concentrada na tarefa de estrutura. Páginas reais e Acordos têm arquivos distintos; os esboços usam novas rotas. Testes preservam regras existentes, não exigem persistência futura.

Fechamento v2.0.0:122 testes gerais,87 cenários autenticados consolidados/1 dispensa, tipos/build e Atlas aprovados; ver registro final para limites e evidências. Sem commit ou publicação.

Revisão final da evidência: fixture de registro com aceite vigente, títulos por rota antes de capturar, espera de carregamento também em768/1024px e proteção contra nomes duplicados na galeria.165 imagens,841 alvos locais e build2.0.0 aprovados.
