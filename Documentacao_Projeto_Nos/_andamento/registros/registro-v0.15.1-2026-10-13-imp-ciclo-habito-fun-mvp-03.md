# Registro — v0.15.1 — 2026-10-13 — Imp. de ciclo real de Hábito com Fun. MVP 03

**Status:** concluído no recorte funcional local; operação online pendente. **Impacto:** PATCH, complemento do histórico existente e correções de navegação/sinalização, sem nova regra de negócio, rota, tabela ou dependência. Base: main em 48fdd3d, checkout inicialmente limpo. DOCS_DIR: Documentacao_Projeto_Nos.

## Objetivo, contexto e requisitos

Conferir todas as doze telas/estados da etapa 03 do MVP no Atlas vivo e concluir pendências viáveis, ordenando o caminho e reservando funções ainda sem contrato. Bases existentes: proposta/conferência (v0.14.0), detalhe/momentos/revisão/confirmação (v0.8–0.11). Preservar regras vigentes e separar dados reais, exemplos do Atlas, futuras ampliações e certificação online.

## Entrega e decisões técnicas

- Histórico de revisões concluídas: 20 itens por página, cursor validado `created_at|id`, desempate e filtros compostos; acesso às antigas e retorno às recentes. Reusa parser de momentos/ciclos.
- Pendência consultada independentemente do cursor e sempre visível. Histórico é lido antes da pendência porque revisões concluídas não reabrem; evita duplicação com estados contraditórios se houver aplicação/recusa entre consultas. Banco continua rejeitando ações obsoletas.
- Detalhe mantém registros de Hábito encerrado e espaços futuros explícitos. Reflexões, Impacto, Linguagens, fotos, Essência/Árvore e evento associado têm limites e dependências, sem indicadores simulados.
- MVP: 18 → 22 → 23 → 24 → 27 → 25 → 28 → detalhe ativo. Tela 29 é alternativa para legado; ajuste/encerramento passam por 30 → 31 OU 32 → 33 → detalhe. Encerramento retorna ao detalhe preservado antes do hub. Visão global e percursos seguem essa distinção.
- Desenho histórico da Tela 24 preservado no modo de referência. No vivo, Impacto/Linguagem/progresso/evento/reflexões sinalizados como planejados; confirmação fica acessível no próprio desenho. Tela 32 não oferece campo de motivo como se persistido; Tela 33 mostra histórico paginado.

Unanimidade inicial/legado/revisão e sete dias de reflexão preservados. Confirmação pós-teste mantém floor(N/2)+1 até 150 e ceil(N/3) acima. Silêncio não vota; membros novos não entram retroativamente; saída de original bloqueia sem reduzir limiar; revisão pendente impede confirmar. RLS e RPCs existentes mantêm autorização, respostas privadas e transações.

## Arquivos e integrações

Produto: `src/app/nucleos/[id]/acordos/[agreementId]/page.tsx` e `revisar/page.tsx`. Banco: consultas nas tabelas/métodos existentes, sem migração. Teste: `tests/authenticated/habit-cycle.spec.ts`. Atlas: `mvp-plan.js`, `screens.js`, `global-view.js`, `product-ui.js`, referência em `index.html`, cobertura/fidelidade/guia, verificador `verify-mvp-habit.mjs`, captura `scripts/capture-mvp-habit-atlas.mjs` e galeria nova. Manifestos: package.json/package-lock.json. Registros: estado/histórico/Brag, roteiro/plano e contrato do ciclo; README e contrato de confirmação atualizados.

## Validações e revisão

- Regressão primeiro falhou na versão anterior sem região/paginação; passou depois com 23 revisões empatadas em data, 20 + 3 sem duplicação, pendência antiga visível e ausência de novo formulário nas duas páginas. Cursor inválido volta à primeira página.
- Quatro testes autenticados desktop/mobile: paginação e ciclo completo com duas pessoas. Proposta/conferência/aceite, humor/nota, prazo, maioria 2/2, recusa, ajuste, novo ciclo sem votos reutilizados, encerramento e registro bloqueado pelo banco.
- Jornada ampliada existente `verify-habit-trial-local.mjs`: quatro originais + conta externa, maioria 3/4, confirmações concorrentes, isolamento, entrada posterior sem voto, ativo, ajustes/ciclos e legado unânime. Executada em cópia C: somente startup `dev` adaptado a `start` compilado; fontes do aplicativo preservadas. Dados temporários removidos.
- `supabase test db`: quatro arquivos de Hábito, cinco casos pgTAP aprovados, incluindo limiares 150/151, privacidade, bloqueios e histórico.
- Suíte geral: 102 testes aprovados na cópia C:. Tipos e build de produção webpack v0.15.1 aprovados; 109 arquivos de fontes/testes/configuração equivalentes por SHA-256.
- Atlas: MVP 03 (12 telas × cinco estados × duas larguras), MVP geral, Visão global e proposta aprovados, sem erros JavaScript/chamadas externas; sintaxe dos quatro scripts conferida. 1155 referências mantidas sem ausentes, 22 capturas e diff conferidos; protótipo histórico Telas e expressão dinâmica antiga excluídos da contagem de referências.
- Autorrevisão + revisão independente: P2 de leitura concorrente corrigido pela ordem das consultas e reconferido. Revisão final detectou P2 de captura vazia (conteúdo absoluto fora da altura auto) e P3 de versões globais: CSS só da captura corrigido com guarda de altura, galeria recapturada, versões e títulos planejados alinhados. Régua ilustrativa de dias removida do modo vivo; fonte histórica preservada. Reconferência independente final sem achados acionáveis. React boas práticas aplicado às duas páginas. Limite normal: página é fotografia da leitura, exige atualização após decisão de outra pessoa.

Primeira rodada do novo teste completo excedeu timeout porque tentava clicar diretamente no rádio visualmente oculto. Automação corrigida para clicar o texto visível e conferir `checked`; ambos os percursos passaram. Sem bypass da interface. Antes/depois do Atlas extraído do commit real de partida; capturas ampliam altura/scroll, colocam o conteúdo absoluto no fluxo e retiram sobreposição da toolbar exclusivamente nessa sessão, sem modificar o layout entregue. Fotos/nomes/notas são fixtures temporárias locais, sem dados pessoais reais.

Ferramentas: Superpowers entendimento/plano/TDD/depuração/revisão/verificação; Context7 Supabase filtros compostos (referência compatível, pacote preservado), Octocode CLI 19.1.0 grafo sintático parcial complementado por leitura. Next.js 16.3.6, Supabase CLI 2.118.0 e Docker locais. Sem instalação adicional.

## Resultado, limitações e próximo passo

Ciclo central concluído e validado localmente, com as doze telas/estados existentes e ampliações reservadas. Antecipação de prazos ocorre exclusivamente em fixtures locais; não comprova prática longitudinal de sete dias. Falha real de rede/banco não foi provocada; estados de erro do Atlas e proteções existentes foram reconferidos. Sem nova garantia de idempotência para envio de proposta.

Operação online requer publicação autorizada, conferência do histórico de migrações no ambiente de uso e repetição com contas autorizadas. Bases de Hábito já têm migrações históricas; nenhuma nova foi criada. Migração de gestão do MVP 02 e SMTP/recuperação do MVP 01 permanecem pendências próprias. Na implementação não houve commit/push/deploy/alteração remota. Commit e push autorizados depois, em 13/10/2026, com controle no [registro de publicação](registro-v0.15.1-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-03.md). Deploy e prova online permanecem pendentes.

Próximo recorte funcional: MVP 04, agenda interna, mediante solicitação; próximo passo operacional depende de autorização para publicação e das credenciais/integrações já registradas nas etapas 01/02.

[Contrato e roteiro de testes de caixa preta](../funcionalidades/ciclo-habito.md) · [Plano executado](../planos/mvp-03-habito.md) · [Comparação](../../wireframes/comparacoes/v0.15.1-2026-10-13-mvp-03-tela_24-tela_28-tela_33/index.html).

**Limpeza final:** zero contas temporárias routing/cycle/trial consultadas; Supabase local encerrado com backup, sem reset. Cópia isolada em C:/Users/Efraim/AppData/Local/Temp/nos-mvp03-20261013 mantida fora do repositório: exclusão bloqueada pela revisão automática de permissões (blocked by policy), sem motivo adicional informado. Evidências copiadas para a galeria. Nenhuma configuração ou migração remota alterada.
