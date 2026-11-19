# Nós — plataforma para cultivar vínculos

O Nós organiza Núcleos, convites, acordos, hábitos e agendas. A participação é voluntária e o acesso aos dados depende das permissões de cada conta e Núcleo.

[Abrir o aplicativo](https://noslife.netlify.app/conta) · [Atlas vivo](docs/wireframes/atlas/index.html) · [Andamento](docs/andamento/estado.md) · [Regras de negócio](docs/regra-de-negocio/) · [Referência visual Next.js](arquivo/nextjs/README.md)

## Stack tecnológica

A aplicação web é Angular com TypeScript, Tailwind CSS e estilos próprios. O Supabase Auth gerencia sessão e o PostgreSQL armazena os dados e verifica autorizações. O Netlify publica os arquivos Angular e executa as funções de avisos de conta e relatos. Playwright cobre jornadas no navegador.

A evolução para Nx, NestJS, WebSocket e Capacitor está no [plano de migração](docs/andamento/planos/migracao-angular.md#ordem-de-implementação).

## Executar localmente

Use Node.js 24 a partir de 24.15, npm e Docker Desktop para o Supabase local. Execute a partir da raiz:

```powershell
npm ci
npm ci --prefix apps/web
npm run supabase:start
npm run dev
```

Abra [Conta local](http://127.0.0.1:4200/conta). Use dados descartáveis e consulte a [caixa local](http://127.0.0.1:54324) para confirmação e recuperação. Siga os pré-requisitos e comandos do [guia da aplicação Angular](apps/web/README.md).

## Comandos de verificação

- `npm run typecheck` verifica os tipos e templates Angular.
- `npm run build` gera os arquivos estáticos em `apps/web/dist/nos-web/browser`.
- `npm test` executa os testes Angular no Playwright com Supabase local.
- `npm run test:integrations` verifica as funções e o isolamento da configuração.
- `npm run test:db` executa as verificações do banco local.

O build hospedado gera a configuração pública do Supabase separadamente. Credenciais do servidor ficam nas variáveis protegidas. [Roteiro Netlify](apps/web/netlify/README.md)

## Arquitetura e decisões técnicas

- [Angular](apps/web/src/app/) reúne telas e serviços por funcionalidade. [Domínio](apps/web/src/domain/) contém regras e utilitários usados na interface.
- [Servidor](apps/web/server/) contém código Node das integrações. [Adaptadores Netlify](apps/web/netlify/functions/) conectam as funções ao ambiente hospedado.
- [Supabase](supabase/) reúne migrações e testes do banco. [Testes Angular](tests/angular/) contêm as jornadas de navegador.
- [Documentação](docs/andamento/readme.md) registra decisões e evidências. O [arquivo Next.js](arquivo/nextjs/README.md) é a referência estética para concluir a paridade.
