# Nós · prévia Angular

Aplicação Angular separada do Next.js durante a migração. A prévia atual cobre a leitura e edição do próprio nome em `/configuracoes/conta`.

Da raiz, com Node.js 24.15 ou superior da série 24 e Docker Desktop:

```powershell
npm ci
npm ci --prefix apps/web
npm run supabase:start
npm --prefix apps/web start
```

Abra [Minha conta](http://127.0.0.1:4200/configuracoes/conta) e use uma conta **local e descartável**. Se necessário, crie e confirme uma conta de teste no aplicativo Next.js conectado ao Supabase local conforme o README da raiz. A sessão da prévia fica no navegador da prévia, separada dos cookies do Next.js. A configuração pública é gerada a partir da CLI (interface de linha de comando) local; o servidor escuta somente em `127.0.0.1`. Caso a porta padrão esteja em uso, execute `npm --prefix apps/web start -- 4201`.

```powershell
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
npm run test:angular
```

O Playwright inicia outra instância na porta 4211 e cria/remove contas locais. O build padrão não copia a configuração local; conexão hospedada, retornos de autenticação e publicação serão avaliados nas entregas indicadas no [plano](../../Documentacao_Projeto_Nos/_andamento/planos/migracao-angular.md).
