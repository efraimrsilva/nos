# Plano — v1.0.0 — MVP 05 administração e participação

Status: implementado, revisado e validado localmente, 2026-10-14. Base main/9153223.

Objetivo: implementar o contrato aprovado em [administração e participação](../funcionalidades/administracao-participacao.md), substituindo votação coletiva por gestão administrativa e consentimento individual.

Arquitetura: migração adicional conserva o histórico e centraliza permissões/transições em funções autenticadas do PostgreSQL. Páginas e ações do Next.js verificam sessão, associação e entradas; a autorização final permanece no banco. Sem dependências novas, chat ou alterações remotas. Stack: Next.js 16.3.6, React 19.3.0, Supabase/PostgreSQL, Playwright.

1. Banco e testes: papéis administrativos, nomeação/aceite, gestão, saída atômica/sorteio/fechamento, preferência e autoria protegida; ciclo administrativo dos acordos e versões com novo aceite. Preservar migrações e históricos; impedir chamadas às funções antigas de votação.
2. Aplicativo: gestão de pessoas e Núcleo; saída confirmada e preferência; suporte/termos; propostas, participação, teste, ativação, encerramento e mudança de termos. Reutilizar rotas existentes de confirmação/revisão para o fluxo vigente.
3. Verificação: testes SQL de permissões e transições; fluxos autenticados com duas contas, negativa de acesso, saída/fechamento e consentimento; tipos/build/testes gerais e revisão completa. Reprodução local, sem confundir com prova online.
4. Atlas e continuidade: ordenar administração → convites → participação → ciclo dos acordos → configurações/saída. Atualizar fichas, cobertura, MVP, contratos e registros; reservas explícitas para futuro. Incrementar versão somente após conclusão revisada e validada.

Critérios: administradores equivalentes; nomeação comum aceita; saída do último administrador sorteia entre associados restantes; último membro fecha e revoga convites; histórico permanece; preferência não retroativa; termos novos nunca reutilizam aceite; membros novos podem participar; não há votação ou cancelamento automático de acordo por saída. Item operacional 5 permanece adiado pelo Google.

Decisões locais serão registradas aqui quando necessárias. Não executar migração remota, envio de mensagem ou deploy. Revisão independente solicitada após implementação; commit/push dependem da autorização aplicável ao conjunto final.

Resultado: contrato executado em banco/app/Atlas.81 testes SQL,81 autenticados (um dispensado),106 gerais, tipos/build e revisão independente aprovados. Migrações do zero e histórico preservado conferidos. Operação/piloto seguem pendentes conforme contrato.
