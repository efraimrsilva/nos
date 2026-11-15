# Registro — v4.0.0-alpha.6 — 2026-11-15 — Imp. de Pessoas no Angular com Fun. de administração e participação

**Status.** A06 na prévia local da branch `codex/migracao-angular`. Base A05 confirmada no GitHub em `addd163`. Next.js v3.11.1.

**Objetivo e requisitos.** Portar edição do nome e do propósito, lista e detalhes de integrantes, nomeação com aceite, destituição, remoção, saída e encerramento. Preservar a compatibilidade de `/nucleos/:id/pessoas`, a alternativa `/nucleos/:id/sair` e o tratamento do histórico compartilhado.

**Decisões e integrações.** O Início usa o roteiro vigente do Atlas. A seção Minha participação abre a saída e oferece encerramento a administradores. Angular Router e o cliente Supabase existentes atendem ao recorte sem nova dependência ou serviço. O formulário valida entradas e usa o token da conta que abriu a operação. As funções existentes verificam novamente papéis, alvo e nome sob trava. A interface registra sucesso após confirmação do serviço.

**Sincronização.** A cada três segundos em aba visível e conectada, Início e Seus Núcleos comparam o resumo de identidade. Com Integrantes aberto, uma leitura também detecta mudanças de participantes, papéis e nomeações. Falha transitória preserva a última leitura daquele escopo e a próxima conferência retenta. Uma leitura que confirme perda de vínculo retira o conteúdo. A atualização aguarda uma operação de gestão em curso. O banco mantém o histórico após saída ou encerramento, e a interface aplica a preferência de autoria retornada pelo serviço.

**Arquivos.** `apps/web/src/app/nuclei/` concentra formulários, quadro de integrantes, saída e sincronização. `app.routes.ts` e `src/features/auth/input.ts` preservam o retorno validado. Os testes cobrem o uso no navegador e os destinos de autenticação. No Atlas, as Telas 13, 71 e 73 incluem os modais de nome e propósito, lista e detalhes de integrantes, confirmação de saída e encerramento. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.6-2026-11-15-angular-pessoas-tela_13-tela_71-tela_73/index.html).

**Verificações.** `npm run test:angular` aprovou 25 testes e pulou no desktop um caso exclusivo de celular. O caso da A06 com duas contas foi repetido com falha temporária de atualização e atraso na confirmação de encerramento. `npm test -- tests/controls.spec.ts tests/session-routing.spec.ts` aprovou oito testes. Os seletores usam o título atual de Conta e a validação permite apenas o marcador de apresentação `integrantes=1`. Tipos e builds aprovados nos dois aplicativos. Banco local com 115 verificações pgTAP em administração, encerramento, identidade e sincronização de perfis. Os verificadores de Migração, MVP e Visão global do Atlas passaram.

**Revisão.** A revisão independente apontou o risco de desmontar o encerramento antes da resposta, perda de rascunho após falha de atualização, mudanças de papéis invisíveis ao resumo e foco antes de o modal renderizar. Esses casos foram corrigidos e conferidos com duas contas no navegador. A galeria compara as telas e os modais em duas larguras e preserva o antes da A04.

**Limites.** As ações estão no contexto do Núcleo. Seletores gerais de Conta e Mais serão integrados nas entregas de preferências e navegação. A verificação de identidade é periódica e depende de conectividade e visibilidade da aba. Nenhuma migração de esquema, roteiro de caixa preta ou publicação.

**Próximo passo.** A07, propostas e respostas. [Plano](../planos/migracao-angular.md).
