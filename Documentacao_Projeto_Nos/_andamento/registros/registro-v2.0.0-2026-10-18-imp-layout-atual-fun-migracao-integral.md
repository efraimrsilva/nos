# Registro — v2.0.0 — 2026-10-18 — Imp. de Layout atual com Fun. migração integral

**Status:** Concluído, revisado e validado localmente. Reformulação ampla classificada como MAJOR (versão principal):1.1.0 →2.0.0. **Imp.** significa implementação; **Fun.**, funcionalidade.

## Objetivo e contexto

O usuário autorizou substituir a apresentação anterior do aplicativo pela referência `Documentacao_Projeto_Nos/Telas/Layout novo`, adequar todas as funcionalidades e links e criar páginas coerentes para módulos sem desenho. Autorizou esboços/simulações visivelmente identificados, ícones coloridos com traço forte e animações orientadas à experiência.

## Requisitos e decisões

Estrutura única com navegação lateral no computador, navegação inferior e menu completo no celular, cabeçalho contextual e rodapé. Entrada pública adaptada com a árvore e as200 frases existentes. Paleta #f5f7f1/#fffefa/#293e35/#345d44/#dce3d6 e tipografia Arial/Georgia da referência. Cards, formulários, estados e páginas de controle compartilham padrões; sem dependência nova.

O conteúdo e as ações permanecem no servidor. As únicas interações do navegador são apresentação, navegação, filtros da página carregada e estados temporários dos esboços. As verificações de sessão/vínculo e os contratos de gravação existentes são preservados. Busca de navegação encontra áreas, sem prometer busca global de dados. Busca de Acordos informa seu alcance de página.

O fluxo Proposta → Hábito → Experiência → Essência é direção aprovada, mas critérios e dados individuais de passagem continuam pendentes. O Kanban distingue Propostas pendentes das categorias atuais e não promove ninguém. A criação direta em categorias atuais permanece compatível, expressamente identificada como modelo atual. Essência não recebe dados inventados como resultados reais.

As seis rotas `/nucleos/[id]/{arvore,memorias,conexoes,perfis,manifesto,cuidado}` são esboços protegidos. Todos os exemplos são ilustrativos; rascunhos vivem apenas em memória e não são enviados/salvos. A central de notificações também é um esboço. As rotas atravessam login por lista segura de retornos, sem aceitar parâmetros privados.

## Arquivos e integrações

- `src/shared/components/application-shell.tsx`, `src/app/layout-system.css`, `src/app/globals.css`, `src/app/layout.tsx`: estrutura, identidade, acessibilidade e microinterações.
- `src/features/onboarding/components/onboarding-shell.tsx`: mantém a interface consumida pelas páginas e encaminha à estrutura vigente.
- `src/app/boas-vindas/page.tsx`, `src/features/auth/components/auth-form.tsx`, `src/features/auth/input.ts`: entrada adaptada, remoção do cálculo vertical legado e retornos novos.
- `src/app/nucleos/**`, `src/features/controls/components/controls-shell.tsx`: Núcleos/Início/agenda/pessoas/convites/controles e Acordos.
- `src/features/agreements/components/agreements-workspace.tsx`, `agreement-presentation.ts`, `agreement-detail-shell.tsx` e `agreements-layout.css`: quadro, painéis, busca/status e detalhes, com as ações existentes.
- `src/features/preview/**`: acesso privado, composições e interações dos seis esboços.
- `tests/layout-system.spec.ts`, `tests/layout-agreements.spec.ts`, `tests/session-routing.spec.ts`, `tests/authenticated/layout-navigation.spec.ts`: regressão da nova estrutura, filtros, retorno seguro, navegação, capturas e isolamento.
- Atlas, fichas, guias e roteiro: atualização na mesma unidade; comparações anteriores são preservadas como história.

O Início consulta três eventos e três acordos reais após validar o vínculo. As consultas são independentes, limitadas e tratam erro explicitamente. A agenda mantém lista, horários por fuso, respostas, edição e remoção; a faixa semanal é leitura dos eventos carregados, declarada em UTC.

## Validações realizadas

- Suíte geral: npm.cmd test -- --workers=1,122/122 aprovados em computador e celular. As expectativas antigas da lista de retornos foram atualizadas para incluir somente as seis rotas de esboço e rejeitar seus parâmetros privados.
- Suíte autenticada consolidada:87 cenários aprovados e1 dispensa prevista. Rodada ampla inicial81 aprovados/6 falhas de verificador ou seletor/1 dispensa; listagem reexecutada2/2; rodada final com fidelidade e navegação5 aprovados/1 dispensa. Capturas intermediárias reconferidas em2/2 testes adicionais. A dispensa evita duplicar um verificador que já cobre computador e celular.
- Fluxos reais locais: criação, convites/aceite/revogação, administração, participação, termos, momentos, agenda, isolamento, sessão renovável/adulterada/revogada e encerramento com preservação do histórico. Banco remoto não acessado pelos testes.
- Nova navegação:26 rotas positivas com título esperado antes da captura, um único conteúdo principal, menu/busca/diálogos, Kanban/Painéis, rascunho de cuidado descartado ao recarregar e negativa das seis rotas sem vínculo. Fixture do registro de momento inclui aceite na versão vigente;404 não pode ser certificado como a tela27.
- Inspeção:1440×1000 e390×844; recortes em640/768/1024px. Espera explícita pelo título evita fotografar apenas carregamentos.21 capturas públicas e62 autenticadas; movimento reduzido, teclado e ausência de transbordamento conferidos nos estados visitados.
- Tipos aprovados. Build de produção webpack aprovado em cópia C: com fontes/recursos comparados por SHA-256 ao checkout G:, conforme ferramenta existente do projeto. Após manifestos2.0.0, tipos e build webpack repetidos e aprovados. Build final sem backend/credenciais, além das builds autenticadas de produção usadas na suíte; fontes/recursos conferidos por SHA-256.
- Atlas:73 telas,207 ações,365 estados,41 referências históricas,52 composições importadas e9 tipos de Núcleo; zero erros ou requisições externas. Verificadores de fidelidade, Visão global, MVP e proposta aprovados.73 prévias móveis capturadas; inventário39 recortes/34 planejadas preservado.
- Acessibilidade do Atlas:73 telas/60 campos inspecionados; rótulos associados e ausência de IDs gerados duplicados. Erro de eventos dependentes da classe antiga foi reproduzido e corrigido com data-local-content, com regressão offline.
- Autorrevisão e revisão independente estática; achados de permissão do menu, cascata de cores, cabeçalhos/avisos, fixture e colisão de imagens corrigidos. Galeria recusa destinos duplicados. Capturas antigas foram restauradas byte a byte após identificar que testes anteriores as sobrescreviam; suítes agora escrevem somente em artifacts.
- Consulta local final confirmou zero contas routing/invite/peer e zero Núcleos da galeria após limpeza. Sem alteração de regras, esquema ou migrações do banco.

## Resultado e limitações

Todas as famílias de rotas usam a estrutura vigente, incluindo entrada, formulários, controles, erros e404. A apresentação do primeiro layout foi retirada das rotas executáveis; materiais e galerias antigos são história preservada. O Atlas mantém os contratos e diferencia os esboços. A galeria documenta referências, antes arquivado, aplicativo e73 fichas; dados/alturas das capturas históricas podem diferir, sem alegar igualdade pixel a pixel.

Persistem como escopo futuro a evolução individual entre as quatro etapas, notificações, memória/fotos/perfis/manifesto/cuidado persistidos e integrações externas. As seis rotas novas são composições interativas sinalizadas; não equivalem a módulos desenvolvidos. Sem certificação nova de SMTP, recuperação externa, banco remoto ou deploy.

## Continuidade e ferramentas

Next.js16.3.6/React19.3/Tailwind4/Lucide/Supabase existentes, sem nova dependência. Context7 consultado em16.2.9 porque16.3.6 não consta no catálogo; versão instalada preservada. OctocodeCLI19.1.0 operacional, grafo parcial por aliases/estilos complementado por buscas locais. Superpowers entendimento, planejamento, execução com subagentes, TDD, depuração, revisão, verificação e fechamento aplicados proporcionalmente.

Branch codex/novo-layout, base de44ca8. Reorganização preexistente dos protótipos preservada. Unidade pronta para commit: código, testes, Atlas, galeria e registros desta migração. Sem commit, push ou deploy nesta solicitação. Próximo passo: revisão visual do usuário; depois, publicação somente mediante autorização e definição própria dos critérios das três passagens individuais.

[Plano concluído](../planos/novo-layout-2026-10-18.md) · [Galeria](../../wireframes/comparacoes/v2.0.0-2026-10-18-layout-atual-tela_01-a-tela_73/index.html).

**Conferência de fechamento:**841 alvos Markdown sem ausências e165 PNGs válidos/únicos; galeria com filtros83/76/4/2 e busca conferida em computador/celular. Tipos e manifestos2.0.0 alinhados; build webpack finalexit0 em cópia temporária removida após conferência de caminho. Capturas intermediárias refeitas após esperar o título correto; Supabase local encerrado preservando backup. Sem commit, push ou deploy.
