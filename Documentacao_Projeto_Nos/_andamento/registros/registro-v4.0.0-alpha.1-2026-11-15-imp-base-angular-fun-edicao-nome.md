# Registro — v4.0.0-alpha.1 — 2026-11-15 — Imp. da base Angular com Fun. de edição do nome

**Status:** A01 validada localmente. Branch `codex/migracao-angular`, base `604a142`. A linha Next.js segue em v3.11.1.

**Objetivo e requisitos:** provar um fluxo protegido no Angular com Supabase. Na prévia `/configuracoes/conta`, ler o perfil, editar o próprio nome de 1 a 80 caracteres após retirar espaços das pontas, confirmar persistência após recarregar e proteger a escrita de sessões expiradas ou trocadas.

**Decisões e integração:** Angular 22 exige TypeScript 6.0, enquanto Next.js usa TypeScript 7. Pacote com lockfile próprio evita misturar compiladores. Angular CLI e Router atendem ao recorte. Microfrontends, biblioteca de componentes e servidor adicional não trazem ganho para esta etapa. Entrada por senha é suporte local. Supabase Auth verifica a identidade e associa a escrita ao mesmo token verificado. Só a propriedade `data.name` é enviada, sem credencial administrativa nem identificador para escolher a conta. Sem mudança no esquema.

**Arquivos:** `apps/web` (prévia e instruções), `scripts/start-angular-local.mjs` (configuração pública local), `playwright.angular.config.mjs` e `tests/angular/profile-name.spec.mjs` (verificação), `playwright.config.ts` e `tsconfig.json` (isolamento das suítes e compiladores), Atlas, plano, contrato de nome e galeria da Tela 66.

**Modal Dados da conta:** abre pelo botão de mesmo nome para a pessoa autenticada. O lápis abre o campo com foco. X, Escape e gesto iniciado e concluído fora fecham o modal. Cancelar descarta a edição e restaura o foco. Durante a gravação não há envio duplicado; erro mantém o rascunho e sucesso exige confirmação da conta esperada. O Atlas demonstra o fluxo sem gravar; a prévia grava no Supabase local.

**Validações:** tipos e builds de Angular e Next.js aprovados. Auditoria npm do Angular retornou zero avisos. Playwright: seis casos Angular e dois de regressão Next.js em desktop e celular emulado. Revisão independente: corrigidos isolamento das suítes e tratamento de falha recuperável na renovação. A suíte provoca falha no envio do nome e revogação de sessão; não força a falha de rede durante a janela de repetição automática da renovação. Guia Migração, Visão global, ficha 66, modal e dez imagens com links locais conferidos. O verificador geral de MVP mantém a falha preexistente na expectativa textual de Google e Apple, já registrada na base. Nenhum roteiro de caixa preta foi criado ou executado. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.1-2026-11-15-angular-nome-tela_66/index.html).

**Resultado e limites:** a prévia usa sessão própria e somente Supabase local; o build padrão não inclui a configuração local. Cabeçalho completo e navegação, demais seções, login social, recuperação, sincronização em Núcleos e publicação ficam para as etapas próprias. Nenhuma operação remota efetuada.

**Próximo passo:** A02, portar a interface compartilhada e conferir navegação persistente, teclado, foco e fechamento de diálogos. [Plano completo](../planos/migracao-angular.md).
