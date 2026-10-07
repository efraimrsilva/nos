# Registro — v0.13.0 — 2026-10-07 — Imp. de navegação protegida com Fun. sessão e Seus Núcleos

**Status:** Concluído, revisado e validado localmente. MINOR: nova rota real de seleção e evolução compatível do fluxo protegido.

## Objetivo e contexto

Corrigir a abertura de etapas privadas sem login e o retorno de toda pessoa autenticada ao onboarding, inclusive quem já participa de Núcleos. Navegador novo reproduziu abertura de /comecar, /comecar/tipo, /comecar/proposito e /comecar/convite; Início, agenda, acordos e convite inicial já pediam conta. O proxy renovava a sessão, mas descartava o resultado da consulta do usuário. O Atlas vivo ainda marcava Seus Núcleos como planejada.

## Escopo e requisitos aprovados

Em 2026-10-07, usuário aprovou proteger /comecar e /nucleos antes da renderização, preservar destinos privados depois do login e implementar a Tela 12. A autorização substitui a permissão anterior de rascunho antes de entrar. Conta, confirmação, recuperação e apresentação opcional continuam acessíveis; nova senha conserva seu protocolo próprio.

Entrada padrão: Conta → Seus Núcleos → Início selecionado. Lista vazia oferece criar Núcleo ou conferir convite. Retorno específico tem prioridade. Criação, convite e consentimento permanecem explícitos; não escolher associação automaticamente. Não implementar módulos futuros da Árvore ou alterar políticas do banco.

## Decisões técnicas e integrações

- Validar identidade pelo Supabase Auth no proxy e conservar verificações de autenticação/autorização nas ações e consultas. A presença do cookie não basta.
- Token de acesso expirado com refresh token válido permite renovação. Sessão ausente, inválida ou não renovável pede login. Indisponibilidade impede acesso, com resposta 503, sem afirmar logout.
- Copiar cookies alterados pelo SSR e cabeçalhos de cache para respostas bloqueadas; páginas privadas usam private, no-store.
- Lista de retornos permite somente rotas implementadas e parâmetros de navegação; rejeita URLs externas, credenciais e parâmetros repetidos. Transporte interno _rsc e avisos resultado não atravessam novo login.
- Tela 12 consulta nuclei com cliente da pessoa; RLS vigente exige associação própria. Ordenação por nome/id e páginas de 20, com um registro adicional para detectar continuação.
- Atlas preserva IDs, exemplos e fontes históricas: Tela 12 passa a Recorte existente, com composição atual da aplicação e caminhos de criação/convite. 72 telas, 41 planejadas, 31 recortes existentes e 14 percursos.
- Testes dos formulários antes públicos passam à suíte autenticada local, sem bypass no código de produção. Suíte sem backend certifica bloqueios. Servidores, caches e resultados isolados.

## Arquivos e evidência

src/proxy.ts; features/auth/input.ts; features/nuclei/nucleus-access.ts; Conta, raiz, /comecar e novas páginas de /nucleos; globals.css; testes, fixture e configuração autenticada; script test-authenticated-local.mjs. Atlas: screens.js, product-ui.js/product.css, atlas.js, global-view.js, cobertura e verificador de fidelidade.

[Galeria antes/atlas/aplicativo](../../wireframes/comparacoes/2026-10-07-sessao-navegacao/index.html). Capturas anteriores preservadas; aplicação autenticada real em desktop/celular e lista vazia comparadas ao Atlas vivo.

## Validações e revisão final

- RED/GREEN dos bloqueios, retorno padrão, assinatura adulterada, refresh malformado e envio com sessão expirada. A causa POST foi reproduzida após corrigir validation_failed; resposta 303 com x-action-redirect corrigiu a navegação do App Router. Teste verifica login, next e ausência de criação no banco.
- npm.cmd test -- --workers=1: 88 aprovados em desktop/celular, sem backend.
- A primeira execução final teve 87 aprovações e timeout de compilação inicial na entrada desktop; prazo específico ampliado para 90 segundos, mantendo as asserções. A repetição completa aprovou 88/88. Galeria final: dez imagens carregadas, sem transbordamento em 1440 e 375 pixels. 809 links locais da documentação/README e diff conferidos.
- node scripts/test-authenticated-local.mjs --workers=1: 44 aprovados, com Supabase local; login/raiz, vínculos próprios, negativa a outro Núcleo, paginação com 21 itens, expiração renovável/não renovável, cookie/assinatura adulterados, revogação seguida de expiração, formulários, teclado e larguras. Capturas adicionais dos retornos foram reconferidas em dois testes da listagem.
- npm.cmd run typecheck: aprovado. NOS_LOCAL_VERIFY=1 npm.cmd run build -- --webpack: aprovado na raiz, cache separado; produção autenticada também compilada em cópia byte a byte de src/public validada por SHA-256.
- Atlas: 72 prévias, 180 saídas, 360 estados, 41 referências/52 layouts e 14 percursos, sem erro JavaScript/rede externa. Visão global: 72 composições compartilhadas, atualização dinâmica, teclado, celular, hash e impressão aprovados.
- Autorrevisão do diff e revisão independente de leitura: corrigidos erros de sessão e protocolo POST; sem achados materiais restantes no código revisado. Links locais e git diff --check conferidos na consolidação.
- Execuções anteriores com cache travado/resultados compartilhados e testes interrompidos não contam como aprovação. Testes funcionais não usam bypass de autenticação. Next/fontes copiados para C: resolvem caminhos entre volumes; demais dependências existentes usam junction, sem instalação nova.
- Windows reservou portas padrão. Supabase local temporário usou 55321–55327; encerrado sem reset, config original restaurado e dados locais preservados. Fixtures e cópias temporárias removidas. Nenhuma alteração remota ou migração.

## Resultado, limites e continuidade

Conta → Seus Núcleos → Início escolhido; retorno específico tem prioridade. Todo /comecar e /nucleos protegido, inclusive rascunho e convite. Token expirado com renovação válida mantém sessão; inválido/ausente/não renovável pede login. Falha operacional impede conteúdo privado com 503. Cookies SSR e no-store conservados nos bloqueios. Banco mantém RLS/autorização por associação, sem chave administrativa na aplicação.

JWT já emitido permanece sujeito ao seu vencimento; revogação de refresh impede renovação e não comprova revogação instantânea de todo token ainda válido. Conteúdo previamente visto não é apagado retroativamente. Integração autenticada desta entrega foi local, sem certificação no ambiente remoto ou deploy. SMTP, segredo/URLs HTTPS e limites operacionais de publicação conservam pendências do contrato Conta. Próximo desenvolvimento planejado: fechar fontes/contrato da Tela 38 Nossa Árvore antes de indicadores.

Versão 0.13.0 em estado/package/lockfile e referências atuais. Nenhum commit, push ou deploy nesta entrega. Unidade lógica pronta: navegação autenticada e entrada por Seus Núcleos; pendência registrada em estado.md.

Publicação autorizada posteriormente na mesma data: [registro Git](registro-v0.13.0-2026-10-07-06-imp-publicacao-git-fun-rastreabilidade-navegacao.md). Inclusão da unidade funcional confirmada por inspeção do objeto; pendência de commit removida no estado após essa prova.
