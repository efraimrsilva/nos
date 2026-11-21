# Registro — v4.0.0-alpha.29 — 2026-11-21 — Imp. da documentação com Fun. de stack e diretórios

**Status.** Revisão documental concluída. Referência do inventário na branch `codex/migracao-angular`, commit `6f718b7`.

**Objetivo.** Adaptar o texto de arquitetura fornecido ao repositório e indicar onde cada parte do projeto deve viver conforme entrar em desenvolvimento.

**Decisões.** O inventário mantém web, funções, testes, dados e arquivo nos caminhos vigentes. A proposta introduz Nx, API NestJS, contratos compartilhados e Capacitor por recortes. Preserva Supabase Auth no primeiro piloto e deixa a decisão de identidade de longo prazo em aberto. A revisão corrige a etapa de retomada desatualizada no plano de migração.

**Arquivos.** [Stack](../../stack.md), [README](../../../README.md), [plano de migração](../planos/migracao-angular.md), [estado](../estado.md) e [histórico](../historico.md).

**Validação.** Comparação com os manifestos, lockfiles, caminhos versionados e configuração Netlify. Consulta pública anônima à página Conta com resposta Angular. Referências oficiais do Nx e Capacitor consultadas via Context7. Revisão do diff e dos links locais alterados.

**Resultado e limites.** A arquitetura e a estrutura-alvo estão prontas para decisão. Aplicação, dependências, build, banco e versão do produto seguem os mesmos. A resposta pública de Conta confirma o atendimento da página e não comprova sessão, revisão publicada ou recebimento de e-mail.

**Próximo passo.** Concluir os recortes de paridade escolhidos e a verificação hospedada. Definir o fluxo piloto NestJS, o tratamento offline e a ordem da PWA em relação ao piloto Android conforme o foco de produto.
