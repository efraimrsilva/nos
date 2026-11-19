# Registro — v2.0.2 — 2026-10-18 — Imp. de conexão Supabase com Fun. correção do login local

**Status:** correção concluída e validada localmente; login com a conta pessoal aguarda confirmação do usuário. Impacto PATCH.

**Objetivo e contexto:** investigar login local e conferir se o banco remoto usado pelo aplicativo está integrado. Preservar credenciais, contas e dados existentes.

**Causa comprovada:** Node 24.15.0 rejeitava a cadeia TLS do Supabase com UNABLE_TO_VERIFY_LEAF_SIGNATURE. O mesmo GET /auth/v1/settings falhava com Node padrão e retornava 200 com --use-system-ca. O formulário local retornava indisponibilidade do Auth antes da correção.

**Decisão técnica:** scripts dev e start do package.json passam a executar o Next por node --use-system-ca. O Node consulta também os certificados confiáveis do sistema operacional, preservando a validação TLS. Documentação oficial consultada via Context7 para Node 24. Nenhuma configuração global, variável secreta ou banco foi alterado.

**Arquivos alterados:** package.json, package-lock.json, README.md, documentação de frontend, estado, histórico, Brag e este registro. Sem mudança de formulário ou regras de autenticação.

**Integrações verificadas:** projeto Supabase configurado em .env.local; Auth habilitado e endpoint disponível. Auditoria somente de leitura pela Management API com credencial já disponível no cofre do Windows, sem expor seu valor. Nove versões de migração locais presentes no histórico remoto; 15 tabelas com RLS (segurança por linha); 14 políticas. As sete tabelas referenciadas diretamente existem; as 26 RPCs usadas pelo aplicativo possuem execução autenticada e bloqueio anônimo nas assinaturas atuais. Comparadas permissões de colunas das 27 consultas select, inclusive a relação de participantes, sem falta. Permissões são em parte por coluna, portanto ausência de SELECT sobre a tabela inteira não significa integração ausente. Consultas REST anônimas às 15 tabelas recusadas com 401/42501, como esperado. Não houve aplicação de migração, escrita de dados ou criação de contas.

**Validações:** antes/depois do transporte com configuração real; formulário de /conta?modo=login no servidor reiniciado por npm.cmd run dev alcançou Auth e recebeu recusa de credenciais deliberadamente inexistentes, sem erro TLS. Dez testes aprovados: npm.cmd test -- tests/auth-service.spec.ts tests/session-routing.spec.ts --workers=1. npm.cmd run typecheck aprovado. Autorrevisão dos scripts e registros; git diff --check aprovado. Servidor mantido em http://127.0.0.1:3000.

**Resultado e limites:** falha local de certificado corrigida; nenhuma lacuna estrutural encontrada nos contratos de banco analisados. Não equivale a login positivo da conta pessoal nem a teste de escrita de todas as funções. Esboços Árvore/Memórias/Conexões/Perfis/Manifesto/Cuidado e notificações continuam sem persistência; evolução individual de Acordos ainda depende de implementação. Sem nova certificação de SMTP, deploy, backup ou restauração. Build/start de produção não executados nesta correção.

**Próximo passo:** atualizar /conta e entrar com a conta pessoal, sem enviar senha ao chat. Caso persista, registrar apenas a mensagem exibida. Commit/push/deploy dependem de autorização.
