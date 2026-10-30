# Edição do nome do perfil — plano executado — v3.4.0

Objetivo: lápis ao lado do nome no modal Dados da conta, compartilhado pela página /conta (66) e perfil desktop (13 e navegação global).

Decisão: edição no próprio modal com Salvar nome e Cancelar, sem segundo modal. Reutilizar name no Supabase Auth, sessão verificada no servidor e limite do cadastro (1–80 caracteres após trim). Atualizar somente name; demais metadados permanecem. Identificador da conta exibida impede gravação por formulário antigo após troca de conta. Sem dependências ou migração. Evolução compatível de funcionalidade: versão final 3.4.0, após validação. Trabalho no checkout atual para preservar a composição local ainda não commitada.

Critérios: lápis acessível por teclado; foco no campo; cancelar não grava; entrada inválida e falha não geram sucesso; envio pendente bloqueia duplicação; confirmação só após resposta; nome e iniciais atualizados; persistência após reload; Atlas demonstra sem acesso ao banco.

- [x] Registrar antes de aplicativo e Atlas; executar teste que falha pela ausência do lápis.
- [x] Criar ação de servidor e editor em controls, integrar AccountPreferences e informar userId pelos dois pontos de composição.
- [x] Sincronizar Atlas e testar cancelamento/edição ilustrativa em desktop e celular.
- [x] Executar testes autenticados locais, tipos e build; autorrevisar diff e revisão independente focal.
- [x] Atualizar contrato, manual, modais, MVP, galeria, registro, brag e continuidade. Alinhar versão após validar; sem commit/push/deploy.

Validação: tests/authenticated/profile-name.spec.ts, scripts/verify-profile-name-atlas.mjs, npm run typecheck, npm run build, verificador compartilhado da Visão global e git diff --check. Contas temporárias exclusivamente no Supabase local, removidas pela fixture. Testes manuais do usuário ficam Não executados.

Ferramentas: Superpowers 7.0.1 (entendimento/plano/TDD/verificação/revisão); Context7 consultado para auth.updateUser (catálogo da versão próxima sem resultado; consulta geral e fontes locais complementam). Octocode não exposto e pesquisa avançada não necessária; buscas locais delimitadas. Nenhuma instalação.
