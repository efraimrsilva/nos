# Registro — v1.0.1 — 2026-10-15 — Imp. de layout interno com Fun. árvore opcional

**Status:** concluído localmente. **Versão:** 1.0.1 (PATCH visual). **Base:** main/ebe8237. **DOCS_DIR:** Documentacao_Projeto_Nos.

## Objetivo e contexto

Retirar a árvore decorativa persistente após o login, conforme decisão do usuário. O painel compartilhado ocupava uma coluna em Núcleos, criação/entrada, convites, acordos, agenda e controles. Retorno futuro depende de benefício concreto para a experiência.

## Requisitos e decisões

OnboardingShell usa showTree=false por padrão e conteúdo central com até 672px, sem reservar espaço para a ilustração ou suas frases. Conta usa !user da consulta existente no servidor; acesso sem sessão mantém a árvore, Conta autenticada não. Boas-vindas opcional preservada. As três páginas auxiliares de Conta usam o shell sem árvore. Sem dependência, consulta de sessão adicional ou mudança de banco. Identidade, links, estados de carregamento e rodapé local preexistente preservados.

## Arquivos e integrações

- src/features/onboarding/components/onboarding-shell.tsx e src/app/globals.css: composição compartilhada e largura.
- src/app/conta/layout.tsx, page.tsx e subpáginas confirmar-email, recuperar, nova-senha: composição conforme contexto.
- wireframes/atlas/product-ui.js e product.css: mesma retirada no desenho vivo; referências documentais históricas preservadas.
- package.json/package-lock.json, README, estado, histórico, Brag e guias de cobertura/fidelidade: versão e evidências locais.

## Validações e revisão

Análise de tipos aprovada. Playwright: 36 testes de Conta/entrada/criação protegida aprovados, desktop/celular. Inspeção real: 12 combinações de quatro rotas públicas em 390/640/1440px, presença/ausência da árvore, main único e ausência de overflow horizontal. Atlas: visão global com 73 telas, composições, sincronização, teclado, mobile, hash e impressão; zero erros/chamadas externas. Sintaxe JS e diff conferidos. Build webpack de produção aprovado: compilação, TypeScript e geração de 19 páginas estáticas concluídos. Autorrevisão e revisão independente estática sem achados bloqueantes.

Context7 consultado para renderização condicional React; catálogo não oferece a versão exata 19.3 instalada, padrão compatível sem migração. Octocode CLI 19.1.0 disponível, grafo sintático parcial (aliases/folha CSS limitam resolução), complementado por busca local de todos os consumidores. Superpowers entendimento, TDD proporcional, revisão e verificação aplicados; ajuste visual reversível validado com testes existentes, sem nova infraestrutura.

## Resultado, limites e próximo passo

Árvore reservada à entrada sem sessão e apresentação opcional. Telas do fluxo interno deixam de renderizar o painel, inclusive carregamentos que reutilizam o shell. [Galeria antes/depois](../../wireframes/comparacoes/v1.0.1-2026-10-15-arvore/index.html): 20 imagens do Atlas (telas 01/07/12/13/18 em duas larguras) e 12 imagens reais das rotas públicas. Exemplos do Atlas não são dados integrados.

Não foi executada nova jornada autenticada com banco: ausência nas telas internas foi conferida na estrutura compartilhada, consumidores, Atlas e revisão. Sem commit, push, deploy ou operação remota. Alterações anteriores de rodapé/loading e registros de implantação continuam pendentes separadamente. Próximo passo: conferir visualmente com uma conta confirmada e publicar somente com autorização.
