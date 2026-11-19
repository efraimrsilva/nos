# Registro — v4.0.0-alpha.16 — 2026-11-19 — Imp. do build Angular com Fun. de virada no Netlify

**Status:** preparação validada localmente. A13 permanece em andamento e as versões da prévia Angular e do Next.js foram preservadas.

**Objetivo.** Com as builds de GitHub reativadas no Netlify, validar a revisão Angular em Deploy Preview antes de substituir a publicação Next.js em `main`.

**Mudanças e integrações.** O `netlify.toml` da raiz prepara a compilação Angular, as duas funções e as regras de roteamento. O modo de produção pode reusar o conjunto Supabase e o segredo de notificação já cadastrados no projeto, sem misturá-los a configurações Angular explícitas nem disponibilizá-los na prévia. URL e chave publicável foram configuradas somente em Deploy Previews. O transporte oficial permanece condicionado à ativação explícita, ao deploy publicado e ao domínio canônico. [Roteiro operacional](../../../apps/web/netlify/README.md).

**Validações.** Vinte testes de integração passaram, incluindo o novo caso de reaproveitamento em produção e isolamento da prévia. A checagem de tipos e o build de produção Angular passaram com valores públicos fictícios. A saída foi conferida e contém somente os campos públicos esperados. O painel confirmou builds ativas e `main` como branch de produção.

**Limites e próximo passo.** Validar a prévia hospedada, confirmar sessão e e-mails no ambiente apropriado e verificar recuperação no Supabase antes de aplicar as quatro migrações pendentes. Promover o Angular somente após validar as funções críticas. O deploy Next.js `6af77e4a9a6348f87af8b9e1` é a referência de retorno. A14 e a paridade visual seguem na ordem aprovada.
