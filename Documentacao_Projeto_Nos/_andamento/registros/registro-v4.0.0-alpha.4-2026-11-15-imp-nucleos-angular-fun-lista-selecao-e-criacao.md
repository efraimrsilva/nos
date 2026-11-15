# Registro — v4.0.0-alpha.4 — 2026-11-15 — Imp. de Núcleos no Angular com Fun. de lista, seleção e criação

**Status:** A04 validada localmente em `codex/migracao-angular`. A03 confirmada no GitHub em `688f880`. Next.js v3.11.1.

**Objetivo e requisitos:** portar Seus Núcleos, Início do Núcleo, Escolher caminho, Tipo e Propósito. Manter vínculo, seleção por conta, rascunho local e criação explícita com papel de administrador. Distinguir carregamento, lista vazia, erro e falta de acesso.

**Decisões e integrações:** Angular Router e os recursos reativos existentes bastam. O núcleo usa Supabase JS, consultas autorizadas pelas políticas de segurança por linha (RLS) e funções já usadas pela linha Next.js. Acrescentada a operação `create_nucleus_once` para vincular a criação à confirmação única. Ela valida o formato do identificador, grava Núcleo e vínculo na mesma transação e devolve o mesmo ID em uma repetição autorizada. A assinatura Next.js continua delegando à mesma criação. Em falha de resposta, a revisão permite repetir a confirmação ou abrir Seus Núcleos para ver se a criação ocorreu. O identificador da tentativa vive no formulário, assim como nome e propósito. Uma nova confirmação após sair ou recarregar cria outro pedido.

**Arquivos:** `apps/web/src/app/nuclei/`, rotas, navegação e atalho de Conta. Migrações `20261115162000_nucleus_creation_once.sql` e `20261115162100_require_navigable_nucleus_id.sql`. Testes de navegador e de banco, Atlas e galeria.

**Telas e modais:** Telas 06–08, 12 e 13. Começar com intenção abre pelo botão Criar um núcleo na lista protegida. Integrantes do Núcleo abre pelo botão Ver integrantes para quem tem vínculo e mostra nome e papel. Ambos fecham por X, Escape e gesto externo. O Início lê agenda, acordos e integrantes reais. Edição administrativa fica em A06.

**Validações:** duas contas locais em Chromium desktop e celular emulado. Confirmação repetida após perda da resposta, ausência de duplicação, vínculo e papel, carregamento/erro/estado vazio, seleção isolada por conta e bloqueio de leitura sem vínculo. A revisão independente encontrou o formato de identificador e a recuperação de resposta incerta, ambos ajustados. Playwright: 21 testes aprovados e um caso exclusivo de celular ignorado no desktop. Banco: 139 verificações em seis arquivos. Tipos, builds e verificadores do Atlas aprovados. Links e 30 capturas conferidos. Não foram criados ou executados roteiros de caixa preta. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.4-2026-11-15-angular-nucleos-tela_06-tela_07-tela_08-tela_12-tela_13/index.html).

**Ambiente e limites:** aplicação das duas migrações no contêiner local com transação e registro verificado. A aplicação automática encontrou a entrada preexistente `20261112025922` no histórico local, sem arquivo nesta branch. A entrada anterior foi preservada. O endereço de convite inicial confirma a criação e abre o Núcleo. Geração, entrada e gestão de convites entram na A05. A linha hospedada ainda precisa ser tratada quando a migração for publicada.

**Próximo passo:** A05, portar convite inicial, entrada, prévia, aceite e revogação com duas contas locais. [Plano](../planos/migracao-angular.md).
