# Plano — MVP 03 — ciclo real de Hábito

Referência vigente: v0.15.1 (base inicial v0.15.0), 2026-10-13, main em 48fdd3d. Escopo autorizado pelo usuário: conferir e concluir o máximo possível da etapa 03, ordenar páginas e reservar evoluções ainda sem contrato. DOCS_DIR: Documentacao_Projeto_Nos.

## Resultado e decisões

Reutilizar rotas, Server Actions e RPCs existentes. Preservar unanimidade inicial/legado/revisão, confirmação proporcional, prazo no banco, respostas privadas, conjunto original e histórico. Corrigir acesso às revisões antigas com cursor data/ID validado; consulta independente mantém a pendência visível em qualquer página. Não criar tabelas, dependências ou funcionalidades das etapas 06–13. Trabalho local no checkout limpo; sem commit, push, deploy ou alteração remota.

## Entregas verificáveis

- [x] Reproduzir falta de paginação com mais de vinte revisões e datas empatadas; provar pendência visível ao navegar e ausência de novo formulário enquanto existe pendência.
- [x] Completar paginação em `src/app/nucleos/[id]/acordos/[agreementId]/revisar/page.tsx`, reusando o cursor validado. Integrar histórico e espaços futuros no detalhe; estados locais de carregamento/erro herdados do Núcleo.
- [x] Conferir duas contas pela interface: proposta/conferência/aceite, teste/registro, prazo/confirmar, recusa/ajuste/novo ciclo e encerramento/histórico. Antecipar prazo exclusivamente em fixtures locais; não alegar observação longitudinal de sete dias.
- [x] Ordenar MVP, percursos, fichas e Visão global; ramificação de legado e alternativas de revisão explícitas. Capturar antes/depois sem substituir galeria antiga; testar Atlas desktop/mobile e estados.
- [x] Executar testes SQL de Hábito, suíte geral, tipos/build e diff. Revisão completa e independente, corrigindo achados introduzidos. Atualizar versão PATCH ao finalizar, contrato/estado/histórico/Brag/registro e contador 102.

Ferramentas verificadas: Superpowers instalado; Context7 Supabase consultado para filtros compostos (referência compatível, versões instaladas preservadas); Octocode CLI 19.1.0 disponível, grafo parcial por imports complementado por leitura local. Supabase CLI em cache e Docker local. Sem novas instalações.
