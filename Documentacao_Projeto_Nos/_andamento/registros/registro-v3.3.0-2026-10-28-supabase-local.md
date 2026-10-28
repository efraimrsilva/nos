# Supabase local preparado — 28/10/2026

Solicitação: preparar o ambiente local para completar a validação dos temas e disponibilizar o desenvolvimento com banco, autenticação e e-mails locais.

## Ambiente e uso

CLI 2.118.0 instalada como dependência exata de desenvolvimento, com lockfile atualizado. Docker Desktop 29.9.2 em execução; stack padrão com PostgreSQL 17.6, Auth, REST, gateway, Storage, Realtime, Studio, Mailpit e serviços auxiliares. As 12 migrações existentes foram aplicadas automaticamente na primeira inicialização. Não foi alterado esquema fora das migrações existentes nem executada operação no projeto remoto.

- `npm run supabase:start`: inicia os serviços locais.
- `npm run dev:supabase`: aplicativo em http://127.0.0.1:3001.
- Studio: http://127.0.0.1:54323. Caixa local de e-mails: http://127.0.0.1:54324.
- `npm run test:db`: testes SQL locais.
- `npm run test:authenticated -- themes.spec.ts navigation-counts.spec.ts`: testes autenticados focados. Sem filtros, o comando disponibiliza a suíte autenticada completa, que não foi executada integralmente nesta rodada.
- `npm run supabase:stop`: parada com volumes preservados.

O helper scripts/local-supabase.mjs resolve a CLI instalada, obtém as credenciais locais sem imprimi-las e recusa URL externa. O dev local sobrescreve somente o ambiente do processo; .env.local e o servidor da porta 3000 foram preservados. Porta 3001 e saída .next-supabase próprias; chave de recuperação aleatória persistida em supabase/.temp, ignorada pelo Git. Retorno Auth da porta 3001 incluído na configuração local; stack reiniciada sem descartar os volumes.

## Verificação

- 12 migrações locais conferidas.
- 160 testes SQL, seis arquivos: aprovados. Advisors de segurança local sem avisos/erros no nível warn ou superior.
- Build webpack autenticado aprovado em cópia de fontes/recursos conferida por SHA-256.
- 10 testes autenticados de temas/navegação aprovados em desktop e celular: nove paletas, mudança imediata, salvamento/reload, leitura em outra sessão, saída sem herdar tema, falha/reenvio, cliques rápidos, indicadores e contagens reais com isolamento.
- Ajustado teste herdado da branch: recuperação com sessão agora abre modal na conta interna e conserva o tema; boas-vindas e telas sem sessão permanecem claras. Nenhuma mudança de comportamento do produto foi necessária.
- Jornada real via navegador na porta 3001: cadastro, entrega da confirmação em Mailpit, confirmação PKCE, sessão, pedido de recuperação, entrega local, redefinição e login com senha nova. Navegador bloqueou acessos HTTP externos durante essa jornada. Conta e duas mensagens temporárias removidas.
- 42 capturas reais na [galeria](../../wireframes/comparacoes/2026-10-28-supabase-local/index.html).

Os roteiros manuais continuam pendentes: M01-100/101 adicionados para o ambiente local (101 casos totais no MVP01), e M05-TEM-007 esclarece a recuperação com sessão. Resultados automáticos não equivalem à aprovação manual do usuário. Fontes e documentação seguem locais, sem commit/push/deploy nesta rodada.

## Ajuste operacional de logs no Windows

A inspeção final encontrou Vector em reinicialização: DOCKER_HOST do coletor apontava para host.docker.internal:2375, conexão recusada. A [documentação oficial](https://supabase.com/docs/guides/local-development/cli/getting-started) descreve a dependência do daemon TCP para logs no Windows. Configurado `[analytics] enabled = false` e reiniciada a stack com backup dos volumes. Não foi habilitada uma nova API do Docker. Logs individuais permanecem via docker logs; o Log Explorer centralizado não está disponível neste perfil. O restante dos serviços do produto continua habilitado. Não foi necessário alterar código do aplicativo ou esquema por esse ajuste.

Conferência após o ajuste de Analytics: dez contêineres ativos, serviços com healthcheck saudáveis; aplicativo, Studio, Mailpit e Auth respondem HTTP200. RPC de confirmação consultada via REST retorna missing para endereço fictício. As12 migrações persistiram após reiniciar; auth.users e public.nuclei sem registros residuais dos testes. Servidor local permanece em execução na porta3001.
