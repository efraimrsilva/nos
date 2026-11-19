# Registro — v4.0.0-alpha.17 — 2026-11-19 — Imp. do isolamento Angular com Fun. de arquivo visual Next.js

**Status:** A13 publicada e verificada no domínio público. A14 validada localmente para publicação. Paridade visual continua a partir do passo 04.

**Virada.** O Netlify publicou `main@6e41268` no deploy [6aff4acac5b6a7d7da2938a9](https://app.netlify.com/projects/noslife/deploys/6aff4acac5b6a7d7da2938a9). A prévia que antecedeu a virada respondeu a links diretos e incluiu as duas funções. No domínio principal, `/conta`, `/nucleos` e `/auth/recovery` serviram Angular com HTTP 200. API desconhecida retornou 404 e as duas funções recusaram requisições sem autorização com 401. A configuração pública apontou para o Supabase esperado. A referência de retorno é [Next.js `604a142`](https://app.netlify.com/projects/noslife/deploys/6af77e4a9a6348f87af8b9e1).

**Banco.** Foram aplicadas em uma transação no projeto `nos-dev` as migrações `20261115162000`, `20261115162100`, `20261115182000` e `20261115182500`. O histórico confirma as quatro versões exatas. As funções novas estão acessíveis para usuários autenticados e indisponíveis para anônimos. As assinaturas antigas continuam disponíveis. Uma cópia local das definições anteriores foi guardada para recuperação. Nenhuma linha de usuário foi alterada pela transação.

**Isolamento.** O [arquivo Next.js](../../../arquivo/nextjs/README.md) preserva o CSS, a marca e as referências visuais. O código executável e os testes legados continuam acessíveis no Git. `apps/web/src/domain` contém as regras usadas no Angular, `apps/web/server` contém o código das integrações e `apps/web/public/brand` contém a marca ativa. A raiz delega os comandos ao Angular. Next.js, React e dependências exclusivas foram retirados dos manifestos ativos. O plano e os links históricos distinguem a referência visual da aplicação em uso.

**Validação.** Checagem de tipos e build de produção Angular aprovados, com a marca presente na saída e sem Next.js no lockfile. Simulação `npm ci` dos dois lockfiles aprovada. Vinte testes de integração e 17 testes Playwright de acesso e navegação passaram, com uma omissão esperada de uma ação exclusiva do celular em desktop. Guia Migração conferida em 1440 e 390 pixels. Testes de acesso com e-mail usaram a caixa local.

**Limites e próximo passo.** As respostas públicas não comprovam login com conta real, renovação de sessão ou entrega de e-mail oficial. A interface mantém a paridade pendente. Retomar as telas 06–09 pelo [mapa de fontes](../planos/paridade-angular-fontes.md).
