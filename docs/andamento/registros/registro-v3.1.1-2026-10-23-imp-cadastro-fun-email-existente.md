# Registro — v3.1.1 — 2026-10-23 — Imp. de cadastro com Fun. de e-mail existente

**Status:** Concluído localmente, revisado e validado; commit e push para GitHub autorizados em 23/10/2026.

**Objetivo/contexto:** corrigir cadastro repetido que seguia para confirmação sem envio de mensagem. Com confirmação ativa, o Supabase Auth pode devolver usuário ofuscado com identities vazio e sessão ausente, sem erro.

**Requisitos:** aviso no formulário para conta existente; acesso pelos caminhos Já tenho conta e Esqueci minha senha; confirmação preservada para cadastro válido; destino interno preservado; nenhuma consulta administrativa de usuários ou alteração no banco.

**Decisão técnica:** tratar códigos user_already_exists/email_exists e resposta sem sessão com identities explicitamente vazio. Resposta sem usuário falha sem prometer confirmação. Usar alerta acessível já existente. A indicação pública de existência no cadastro atende à solicitação; recuperação e reenvio continuam neutros. Não consultar existência antes do cadastro evita uma consulta adicional e uma condição de corrida.

**Arquivos/integrações:** src/features/auth/actions.ts; tests/auth-service.spec.ts; Atlas screens.js e mvp-plan.js; manifestos e registros após validação. Integração permanece auth.signUp do cliente servidor Supabase, com redirecionamento Next.js e formulário React existente.

**Validação:** testes escritos antes do código reproduziram três falhas esperadas (resposta ofuscada, códigos explícitos, resposta sem usuário). Após ajuste, 36 testes focados de autenticação/entrada em desktop/mobile passaram. Suíte geral: 142 testes aprovados; tipos e build padrão Turbopack aprovados; Visão global do Atlas aprovada (73 telas, teclado/celular, sem erros). Autorrevisão e revisão independente sem achados necessários.

**Resultado/limitações:** correção validada localmente, com publicação GitHub autorizada; nenhuma migração ou operação em contas reais. Respostas do serviço externo isoladas nos testes da ação real; entrega externa de e-mail e comportamento em produção não certificados nesta tarefa. O usuário pendente continua no fluxo de confirmação; a resposta pública do Auth não distingue cadastro novo de cadastro ainda não confirmado.

**Próximos passos:** verificar conteúdo do commit, push e igualdade com origin/main; depois validar online quando houver deploy correspondente confirmado. PATCH compatível 3.1.1.

**Publicação autorizada:** incluir todas as 12 alterações da entrega em um commit lógico, com título e corpo descrevendo comportamento, regressões cobertas, Atlas, documentação, versão e validações. Publicação GitHub não certifica deploy/recebimento externo. Referência final disponível no histórico Git do commit que contém este registro.
