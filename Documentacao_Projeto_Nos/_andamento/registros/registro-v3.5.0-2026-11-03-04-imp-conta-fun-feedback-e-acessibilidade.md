# Registro — v3.5.0 — 2026-11-03 — Imp. de Conta com Fun. feedback e acessibilidade

- **Versão:** 3.5.0, integrante da consolidação MINOR.
- **Status:** Concluído e validado localmente — publicação Git sob controle do estado canônico; sem certificação de deploy ou migração remota.
- **Objetivo/contexto:** consolidar melhorias solicitadas para legibilidade dos campos de senha, entrada das seções da conta, decoração da árvore e reconhecimento de ação destrutiva.
- **Requisitos:** Mostrar/Ocultar senha por toque/teclado sem enviar; oito luzes; movimento reduzido; gatilho de exclusão vermelho nos nove temas; preservar conta completa no celular.

## Decisões e integrações

`PasswordInput` compartilha o campo com alternância entre `password` e `text`, mantendo o valor e as propriedades de formulário. O botão é `type=button`, tem rótulo Mostrar senha/Ocultar senha, associação ao campo e acompanha seu estado desabilitado. Integra login, cadastro e definição de nova senha, sem alterar a política de senha ou autenticação.

As luzes decorativas passam de cinco a oito, com distribuição inicial e renovação de trajetória após hidratação; não são conteúdo acessível nem dado persistido. O painel nativo desktop herda a entrada suave das seções da conta. Preferência por movimento reduzido elimina as animações aplicáveis. O gatilho de exclusão usa vermelho no texto/ícone/realce/foco em todos os temas; o contrato de confirmação, autorização e retenção continua o da [exclusão da conta](../funcionalidades/exclusao-conta.md).

Perfil desktop continua com painel menor de seis seções; `/conta` permanece a página completa para computador e celular. O teste de painel desktop é intencionalmente inaplicável no projeto móvel; isso não dispensa conferir o acesso móvel à página completa.

## Arquivos e documentação

`src/features/auth/components/password-input.tsx`, `auth-form.tsx`, `access-forms.tsx`, `src/features/auth/account-motion.css`, `src/features/controls/components/account-popover.tsx`, `src/features/controls/accounts-layout.css`, `src/features/onboarding/components/account-tree-lights.tsx`; `tests/account.spec.ts`, `tests/account-lights.spec.ts` e `tests/authenticated/account-motion.spec.ts`. [Contrato de conta](../funcionalidades/conta-entrada.md), [aparência](../funcionalidades/aparencia-conta.md), [modais](../funcionalidades/modais-interface.md) e [roteiro M01-AJU-001/M05-AJU-001–003](../testes-caixa-preta/ajustes-v3-5.md).

## Validação, resultado e limites

Rodadas anteriores informadas na sessão: quatorze testes públicos de conta/luzes aprovados; onze cenários autenticados de movimento/seleção aprovados e um ignorado por ausência intencional de painel desktop no celular. Reexecução final está em andamento pelo agente principal. Não houve comprovação em aparelho físico/Safari, nem execução manual do usuário. Novos casos permanecem Não executados.

Não atribuir ao controle de visibilidade correção de riscos anteriores de política de senha, enumeração ou sessão. Nenhuma nova promessa de anonimização ou exclusão de backups foi introduzida. Próximo passo: concluir testes/Atlas/galeria e registrar o resultado final no [registro transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md).

### Verificação final da v3.5.0

Vinte testes públicos de conta/luzes/proposta/renovação simulada aprovados; tipos e build finais passaram. Rodada autenticada atual: 23 aprovados, duas falhas de expectativas antigas para aliases da Conta e um ignorado, em 2,3 minutos. Inspeção das fontes confirmou que `/configuracoes`, `/privacidade` e `/ajuda` já redirecionam para a Conta consolidada, com seção/hash correspondente; não são novas telas criadas por esta entrega. O roteiro foi corrigido para verificar os títulos atuais e URLs/hashes canônicos, com reteste dos dois casos em execução. Os quatro cenários de paridade passaram, inclusive modais estreitos e acesso equivalente; cinco verificadores do Atlas passaram, com busca local restaurada após revisão P3. O ignorado continua sendo painel exclusivamente desktop, sem afirmar aprovação móvel desse painel. [Fechamento e limites](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md).

### Fechamento local confirmado

Reteste específico dos dois cenários de navegação aprovado: computador em 23,4 segundos e celular em 17,3 segundos (rodada de aproximadamente 1,2 minuto). O conjunto de 26 casos únicos fecha com **25 aprovados e um ignorado intencional**, consolidando 23 aprovações da rodada anterior e as duas falhas de aliases corrigidas/retestadas. Não houve uma única rodada com 26 aprovações; falhas e retestes permanecem preservados neste registro e no histórico de resultados. O ignorado corresponde ao painel de perfil desktop, intencionalmente ausente no celular.

Tipos finais v3.5.0, build final webpack, vinte testes públicos e sete testes pgTAP locais aprovados; cinco verificadores do Atlas aprovados. [Galeria v3.5.0 com aplicativo real](../../wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela_01-tela_05-tela_12-tela_13-tela_14-tela_18-tela_66-tela_73/index.html#aplicativo-real): dezoito capturas reais (duas anteriores e dezesseis posteriores) e 36 capturas do Atlas, totalizando 54 imagens. A galeria distingue antes/depois, aplicativo/Atlas e seus limites; não certifica aparelho físico ou Safari. Publicação Git será registrada pelo agente principal no estado canônico. Deploy e aplicação remota da migração continuam sem comprovação; os 24 casos novos de caixa preta permanecem Não executados pelo usuário.
