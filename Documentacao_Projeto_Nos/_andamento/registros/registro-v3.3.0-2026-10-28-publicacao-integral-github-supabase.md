# Consolidação integral e sincronização Supabase — 28/10/2026

Usuário autorizou commit e push do conjunto acumulado para o GitHub, com descrição abrangente, e pediu sincronização da base Supabase. Destino Git: origin/main (https://github.com/efraimrsilva/nos). Projeto remoto conferido pela configuração do aplicativo: nos-dev, pyvohqgcwkcfzbtkmbvx, ACTIVE_HEALTHY.

## Escopo do commit

- Integração da branch de aparência ao código atual: nove temas por conta, seletor em Mais/menu lateral/Configurações, aplicação imediata, persistência no Auth, falha/reenvio, cliques rápidos, navegação contextual e cores dos ícones preservadas.
- Totais pessoais de Núcleos, Acordos, Agenda e Pessoas, com descrições acessíveis, escopo global da própria conta, atualização ao navegar/recarregar e estado indisponível sem zero fictício.
- Ajustes acumulados de Conta e Atlas: cabeçalho simplificado, retorno pelo logotipo, compatibilidade com os modais atuais de confirmação/recuperação e preservação da árvore/reflexões e rodapé.
- Correção do transporte de desenvolvimento no Windows com proxy e certificados do sistema; inicialização nativa pelo Node, retirada dos scripts antigos dev/dev-network e adaptação do configurador de e-mails.
- Supabase inteiramente local: CLI 2.118.0 fixada, comandos de iniciar/parar/status/testes, aplicativo isolado na porta3001, Studio54323, e-mails54324, chave local de recuperação ignorada pelo Git e saída .next-supabase própria. Analytics/Vector desativados neste Windows por dependência da API TCP do Docker; os serviços do produto permanecem habilitados.
- Ajuste de build Netlify: remove somente caches descartáveis antes da varredura, preservando servidor, arquivos públicos e verificação de segredos.
- Atlas, contratos, histórico, plano, roteiros manuais e galerias incluídos; MVP01 com101 casos, aparência com16 e navegação com12. Resultados manuais continuam Não executados.

## Sincronização de banco

As12 migrações existentes já estavam no projeto remoto, incluindo navigation_counts e email_confirmation_status. Comparação adicional detectou quatro funções da agenda sem o bloqueio comum no banco local: a migração histórica usava substituição literal de begin+LF, que não corresponde ao corpo com CRLF obtido no Windows.

Nova migração20261028175254_sync_calendar_member_locks: normaliza as quebras da definição de trabalho e inclui o bloqueio somente quando ausente. Aplicada local e remotamente; no remoto os quatro corpos já estavam corretos e foram mantidos. Nenhuma tabela, dado, assinatura, retorno ou permissão foi alterado pela correção. Agora são13 migrações nos dois ambientes.

Conferência:43 funções da aplicação com mesmos hashes de corpo, security_definer, search_path e permissões de execução anon/authenticated. As15 tabelas têm as mesmas colunas, restrições, índices, RLS habilitada e expressões de políticas. Contagens/hashes das15 tabelas remotas idênticos antes/depois da migração. Não foram copiados dados de teste ou contas locais para o remoto. O tema usa metadados da própria conta e não exige tabela própria.

Advisors remotos registram avisos existentes de execução de funções SECURITY DEFINER, proteção contra senhas vazadas desativada e tabela de nomeações com RLS sem política. Não foi anunciada auditoria universal nem alterado o modelo de permissões nesta publicação. Referências: [funções públicas](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [funções autenticadas](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection), [RLS sem política](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

## Validação do conjunto

- 184 cenários gerais aprovados entre execução geral e retestes da integração, conforme registro anterior.
- 160 testes SQL locais aprovados novamente após a migração corretiva.
- 10 cenários autenticados de temas/navegação aprovados em desktop e celular contra Auth/banco reais locais.
- Novo teste concorrente local: quatro operações da agenda aguardam bloqueio compartilhado do Núcleo e funcionam após sua liberação; comando npm run test:calendar-locks. Fixture removida.
- Tipos/build de produção, Atlas de aparência/navegação e jornada de cadastro/confirmação PKCE/recuperação/troca de senha/login com e-mails locais aprovados nesta sessão.
- 42 capturas reais em [Supabase local](../../wireframes/comparacoes/2026-10-28-supabase-local/index.html), além das galerias históricas recuperadas e da prévia de integração.

A suíte autenticada completa permanece disponível pelo comando sem filtros, mas nesta sessão foi executado o recorte declarado de temas/navegação. Este registro não certifica um novo deploy Netlify. A confirmação do push e o identificador do commit são apresentados no fechamento da publicação.
