# Registro — v3.6.0 — 2026-11-03 — Imp. de banco hospedado com Fun. edição de identidade

**Status:** reparo aplicado e validado no banco hospedado. **Versão vigente:**3.6.0, sem incremento: nenhuma alteração nova de código/interface/Atlas; aplicação da migração já pertencente à versão3.6.0. **DOCS_DIR:** Documentacao_Projeto_Nos. Branch main, base7bd1eac. Alterações anteriores da reorganização preservadas, sem commit/push/deploy nesta interação.

## Objetivo e contexto

Usuário relatou que alterar nome e propósito não salvava. Critérios: identificar causa, restaurar as duas gravações no ambiente configurado sem sobrescrever o outro campo, manter administração/permissões e preservar dados existentes.

## Causa verificada

O servidor local na porta3000 usa o Supabase hospedado pyvohqgcwkcfzbtkmbvx, e não o banco local dos testes anteriores. A chamada HTTP à RPC update_nucleus_identity retornou404/PGRST202, função ausente no cache do esquema. Consulta de metadados confirmou função inexistente e migração20261103160000 não registrada. As dependências lock_nucleus_member(uuid,boolean) e update_nucleus_details(uuid,text,text) já existiam. A falha era implantação incompleta da migração; não foi necessário alterar os formulários.

## Reparo e decisões

Aplicada somente supabase/migrations/20261103160000_nucleus_identity_fields.sql no projeto configurado. Criação da função, permissões e registro em supabase_migrations.schema_migrations ocorreram na mesma transação. NOTIFY pgrst solicitou recarga do esquema. Nenhuma outra migração pendente foi aplicada; nenhum reset, alteração de dados existentes ou publicação de aplicativo.

Hashes das linhas de nuclei e nucleus_members foram comparados dentro da transação de aplicação; divergência abortaria o reparo. Quantidades antes/depois:5 Núcleos e6 vínculos, preservados. A nova função usa a trava administrativa existente e altera um campo por chamada. EXECUTE concedido a authenticated e negado a anon; a função revalida administração, não apenas autenticação.

## Validações

- Antes: API404/PGRST202; metadados com função ausente e migração não registrada.
- Depois: função instalada e migração registrada, permissões conferidas. API deixou de retornar PGRST202 e respondeu401/42501 à chamada anônima, como esperado.
- Teste remoto em transação com usuários/Núcleo temporários gerados por UUID: administrador altera nome preservando propósito; depois altera propósito preservando nome; nome vazio rejeitado; participante comum rejeitado.
- ROLLBACK removeu todos os dados temporários. Quantidades finais iguais às iniciais. Nenhum nome/propósito real foi alterado pelo teste.
- Revisão do SQL aplicado: fonte idêntica à migração versionada; alteração de esquema, histórico e comparação de integridade transacionais. Autorrevisão operacional; nenhuma nova revisão independente nesta interação.
- Build/tipos/suíte de aplicativo não repetidos, pois não houve mudança de código. Não foi operada a sessão pessoal do usuário no navegador; a gravação no servidor/banco hospedado foi validada com identidade temporária em transação.

## Arquivos e ferramentas

Fonte aplicada: supabase/migrations/20261103160000_nucleus_identity_fields.sql, preservada. Roteiros transitórios ignorados pelo Git: artifacts/repair-nucleus-identity/apply.sql e verify.sql. Registros afetados: estado/histórico, contrato de organização, resultados de caixa preta e Brag. Atlas e manifestos permanecem3.6.0, pois interface/contrato funcional não mudaram.

Superpowers depuração sistemática/TDD/verificação e skill Supabase utilizados. Context7 consultado para CLI2.118.0. Conector Supabase anunciado não estava disponível para execução; usada CLI oficial autenticada com --linked --project-ref, sem imprimir credenciais. Primeira consulta exigiu --linked, corrigido após erro explícito; um diagnóstico Node inicial precisou declarar o modo de módulo, sem impacto nos dados. Octocode não exposto e sem necessidade de pesquisa avançada entre repositórios.

## Resultado, limitações e próximo passo

Dependência ausente reparada no ambiente configurado. Reabrir os modais no aplicativo e repetir o teste com a própria conta. Não certificar sessão pessoal, Safari/dispositivo físico ou deploy novo. Casos de caixa preta M02-ORG-002/003 permanecem Não executados pelo usuário até ele informar o reteste; evidência automatizada/técnica é separada. Migração de contagens de respostas pendente no remoto continua fora deste reparo.

Pendência Git anterior mantida: reorganização do Núcleo, incluindo fonte da migração agora aplicada, Atlas/testes/versão/docs e este reparo operacional. Nenhum commit criado; não remover pendência. Próximo passo executável: reteste do usuário e publicação do conjunto quando autorizada.
