# Registro — v0.11.0 — 2026-10-06 — Imp. de revisão de autenticação com Fun. contratos de segurança

**Versão funcional:** 0.11.0. **Edição documental:** v2.8. **Status:** revisão documental concluída; funcionalidades futuras não implementadas.

## Objetivo e contexto

Usuário solicitou revisar a documentação frente a oito requisitos originais e autorizou incorporar as sugestões. O projeto foi localizado em D:/Proj/nos; a pasta D:/Estudos/Projeto Nós informada no contexto não existe. A base Git estava limpa. Documentação isolada não incrementa a versão do aplicativo.

## Requisitos e decisões

Requisitos abrangidos: Google, Apple, biometria, recuperação de senha, sessões/expiração, criptografia e LGPD/GDPR, autorização/tokens e comparação de stack. Supabase permanece escolhido. Especificação distingue código existente, planejamento e propostas; política de senha, prazos de sessão e retenção dependem de entrega/configuração própria.

Corrigidos bloqueio local versus validade remota, transporte web por cookies versus mobile por tokens, limites de exportação estática do Next.js, garantias de RLS do exemplo, revogação residual de JWT e desvinculação versus anonimização. Complementados callbacks, identidades, armazenamento biométrico, direitos dos titulares, SMTP, abuso e critérios de aceite. Decisão canônica de segurança do Hábito preservada.

## Arquivos alterados

- [Especificação v2.8](../../Projeto_Nos_v2.8_Autenticacao_e_Seguranca.md).
- [Estado](../estado.md), com índice desta revisão.
- [Histórico](../historico.md), incluindo correção do cabeçalho de versão vigente para 0.11.0.
- Este registro.

## Integrações e validações

Nenhuma integração executada ou configuração remota alterada. Conferidos ações de autenticação, opções de cookie, cliente de servidor, proxy e migrações de membros/acordos. Consultadas fontes oficiais Supabase, Next.js, NIST, LGPD/GDPR, Firebase e Auth0, citadas no documento.

Revisão de coerência dos contratos, links locais, cercas de código e git diff --check. Não executados build, suíte funcional ou testes com provedores: alterações somente em Markdown. Validação documental não comprova segurança operacional ou conformidade jurídica do aplicativo.

## Resultado, limitações e próximos passos

Documentação incrementada com status dos requisitos, fluxos e critérios verificáveis. Versão funcional 0.11.0 mantida; código, banco e desenhos de interface sem alterações. Sem commit, push ou deploy nesta interação.

Recortes futuros de autenticação devem implementar os contratos e registrar configuração efetiva/evidências antes de publicação. A continuidade funcional de Nossa Árvore permanece; mudanças de interface seguirão o Atlas vivo. Prazos concretos de retenção, arquitetura mobile e controles de sessão seguem pendentes, explicitamente registrados na v2.8.
