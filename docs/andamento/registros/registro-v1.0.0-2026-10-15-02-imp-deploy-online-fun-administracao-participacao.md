# Registro — v1.0.0 — 2026-10-15 — Imp. de deploy online com Fun. administração e participação

**Status:** aplicação e banco implantados; percurso central validado online. Piloto completo continua parcial pelas dependências abaixo. Versão 1.0.0 preservada: operação de uma entrega existente, sem nova funcionalidade ou alteração de fontes.

## Objetivo, contexto e autorização

Usuário solicitou concluir o deploy para tornar funcional o endereço online. A publicação Git anterior já havia acionado a implantação automática. O banco remoto ainda tinha seis migrações e não oferecia os contratos administrativos exigidos pelo aplicativo. A autorização atual permite coordenar banco, aplicação e verificação isolada; o envio pelo Google havia sido explicitamente adiado.

## Implantação e preservação

- Branch `main`, commit completo `ebe823727a1c609e031a0193d8d6f860ef999884`, versão 1.0.0.
- Netlify `noslife`, deploy publicado `6ad055c8a42c00493a8198b9`, [detalhes](https://app.netlify.com/projects/noslife/deploys/6ad055c8a42c00493a8198b9), [aplicativo](https://noslife.netlify.app), [endereço imutável](https://6ad055c8a42c00493a8198b9--noslife.netlify.app).
- Supabase `nos-dev`, referência `pyvohqgcwkcfzbtkmbvx`: aplicadas `20261013150000_manage_nucleus_invitations.sql` e `20261014120000_nucleus_administration_and_participation.sql`, em uma transação com verificação do histórico inicial, trava transacional e limites de espera/execução.
- Migrações e seus registros inseridos na mesma transação. Consulta posterior confirmou oito versões e igualdade exata entre as duas novas instruções armazenadas e os arquivos locais. Não houve `reset` remoto.
- Antes e depois: um Núcleo e dois vínculos existentes; nenhum acordo ou momento existente foi alterado. O papel antigo de criador foi convertido para administrador pela migração. Zero papéis `creator` e zero contas temporárias de deploy após a limpeza.
- Antes da operação, foi criado snapshot seletivo local, criptografado pela proteção de dados do Windows e conferido por hash após decifração, em `artifacts/nos-production-before-20261015.dpapi` (ignorado pelo Git). Abrange esquema/contratos/permissões, histórico de migrações e metadados de associação. Não contém textos de momentos/notas, não é backup integral e não comprova restauração de produção.

A CLI (interface de linha de comando) Supabase 2.118.0 respondeu à descoberta de projetos, mas a criação de credencial temporária para `migration list --linked`/`db query --linked` não concluiu. Foi usada a API (interface de programação de aplicações) oficial de gerenciamento, autenticada com a credencial já existente da CLI no cofre do Windows. Tokens e chaves permaneceram em memória e não foram incluídos nas saídas ou nos registros. Não houve desativação de validação de certificados.

## Verificação no ambiente publicado

Executado `node --use-system-ca artifacts/verify-online-admin.cjs`, verificador operacional local ignorado pelo Git, com duas contas confirmadas descartáveis. Resultado: **11 grupos aprovados**, limpeza concluída e nenhuma conta de teste restante. A confirmação administrativa das contas evita envio de e-mail; não comprova o cadastro público.

1. HTTPS (conexão segura) e barreira de sessão nas rotas privadas.
2. Duas contas entram pelo formulário publicado e mantêm sessão.
3. Criação de Núcleo, convite e entrada da segunda pessoa.
4. Nomeação concede administração somente após aceite da pessoa nomeada.
5. Páginas de pessoas, convites, configurações, privacidade, segurança, ajuda e saída renderizam com dados reais.
6. Preferência de autoria salva pela ação de servidor do site publicado e conferida no banco.
7. Proposta, participação, início de teste e registro de momento persistem e aparecem no aplicativo online.
8. Mudança de termos exige novo aceite; aceite antigo não permite registrar; administrador ativa sem votação coletiva.
9. Saída pelo formulário publicado revoga acesso, promove o único participante restante e preserva o momento com autoria oculta. A escolha aleatória com múltiplos candidatos foi testada localmente; o caso online tinha um candidato.
10. Saída do último membro encerra o Núcleo; convite antigo não permite reentrada.
11. Logout pelo aplicativo encerra a sessão e restabelece a barreira de acesso.

O verificador combinou formulários HTTP (protocolo de comunicação web) reais de login, preferência, saída e logout, leitura das páginas publicadas e chamadas autenticadas às funções do banco. Não foi uma execução integral por cliques no navegador. A tela de entrada também foi conferida visualmente no navegador. Todas as mutações de teste ocorreram em um Núcleo temporário, removido junto com as duas contas. O resultado sem credenciais está em `artifacts/online-verification-result.json`, ignorado pelo Git.

## Configuração conferida e limitações

Origem de autenticação: `https://noslife.netlify.app`. Retornos de confirmação e recuperação online e locais autorizados, incluindo destino `next`. Três variáveis existentes no Netlify: `APP_ORIGIN`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; seus valores secretos não foram expostos. Confirmação de e-mail permanece exigida. SMTP (servidor de envio de e-mails) próprio desativado; não houve redução dessa proteção.

Configuração remota informa limites de envio de e-mail de 2, renovação de token de 150 e verificação de 30. Esses valores são os campos retornados pela plataforma, sem inferir unidades ou cobertura de todos os endpoints. Não foi feito teste de carga, bloqueio por tentativas ou inspeção abrangente dos logs; ausência de segredos em todos os logs não está certificada.

**Pendências reais:** liberação Google/configuração SMTP e recebimento externo de confirmação/recuperação; `AUTH_RECOVERY_SECRET` ausente no Netlify; procedimento e prova de backup integral/restauração; verificação abrangente de limites/logs; termos e política completos e rotina operacional de direitos/retenção. Suporte exibe Sintagma Software e seu e-mail, sem comprovar atendimento. Essas pendências não foram convertidas em bloqueio fictício das contas já confirmadas, mas impedem declarar cadastro/recuperação externos e piloto completo concluídos.

## Arquivos, revisão e próximo passo

Atualizados README, estado, histórico, Brag, manual e plano da mesma entrega, além deste registro. Nenhuma fonte, dependência ou manifesto foi alterado. Autorrevisão documental e `git diff --check`; não houve nova revisão independente nesta operação. Build do deploy confirmado publicado pela plataforma; compilação local não foi repetida por não haver mudança de código.

Próximo passo: acessar o aplicativo com conta já confirmada. Quando o Google liberar o envio, configurar SMTP em ambiente seguro, definir o segredo somente no servidor e comprovar os e-mails e a recuperação completos. Completar backup/restauração e demais controles antes de liberar o piloto integral. Registro operacional local pronto para commit, sem novo commit/push nesta solicitação de deploy.
