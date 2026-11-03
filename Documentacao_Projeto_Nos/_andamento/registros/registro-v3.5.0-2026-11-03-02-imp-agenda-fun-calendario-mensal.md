# Registro — v3.5.0 — 2026-11-03 — Imp. de Agenda com Fun. calendário mensal

- **Versão:** 3.5.0, integrante da consolidação MINOR.
- **Status:** Concluído e validado localmente — publicação Git sob controle do estado canônico; sem certificação de deploy ou migração remota.
- **Objetivo/contexto:** substituir a navegação mensal limitada por calendário completo no computador e no celular, sem corte fixo no ano 2030.
- **Requisitos:** escolher mês/ano/dia, atravessar meses/anos, abrir semana correspondente, manter contraste, acessibilidade e responsividade.

## Decisões e integrações

Adotado `react-day-picker` 9.14.0, fixado no manifesto/lockfile. `CalendarMonthPicker` usa português do Brasil, segunda-feira como início, seis linhas e dias adjacentes, seleção de mês/ano e setas. A janela de anos se recalcula em torno do mês exibido com ±100 anos, limitada a 1–9999. Não há corte em 2030. Selecionar dia atualiza a semana; mudanças de semana mantêm o mês escolhido enquanto existir interseção, e acompanham a próxima mudança de mês. UTC (tempo universal coordenado) mantém consistência com a grade existente.

O mês aparece em ambos os tamanhos. Acima de 900 pixels a agenda semanal usa grade; até 900 pixels usa lista, com ações reais de eventos preservadas. O marcador de dia com evento considera apenas os registros carregados na página, sem prometer consulta integral. Cores de dias/opções são ajustadas para temas escuros. O calendário é parte da tela, não um modal. Nenhuma regra de criação, resposta, fuso, remoção ou consentimento foi alterada.

## Arquivos e documentação

`package.json`, `package-lock.json`, `src/features/calendar/components/calendar-month-picker.tsx`, `calendar-workspace.tsx`, `calendar-workspace.css` e `tests/authenticated/mobile-adjustments.spec.ts`. [Contrato vigente](../funcionalidades/agenda-interna.md), [aparência](../funcionalidades/aparencia-conta.md) e casos M04-CAL-001–004 no [roteiro](../testes-caixa-preta/ajustes-v3-5.md).

## Validação, resultado e limites

Rodada anterior informada na sessão: dezesseis cenários autenticados de ajustes móveis/calendário aprovados, incluindo passagem 2030→2031 e sincronização de semana/mês. Reexecução final está sob responsabilidade do agente principal. Não constitui teste em aparelho físico ou Safari, nem aprovação manual. Os quatro casos novos permanecem Não executados pelo usuário.

Recorrência, calendários externos e busca de todos os eventos do mês continuam fora deste recorte. Próximo passo: conferir tipos/build, seleção final, Atlas e evidência visual desta versão; complementar o [fechamento transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md).

### Verificação final da v3.5.0

`npm run typecheck` e `NOS_LOCAL_VERIFY=1 npm run build -- --webpack` finais aprovados. Rodada autenticada atual terminou com 23 aprovados, duas falhas de expectativas antigas de navegação para Conta e um ignorado em 2,3 minutos. Os quatro cenários de paridade passaram, cobrindo destinos, apresentação e acesso às ações nas larguras verificadas; o calendário e demais cenários de ajustes móveis passaram nessa seleção. Os dois casos de navegação foram atualizados para URL/hash canônicos e estão em reteste específico. Cinco verificadores do Atlas passaram e a busca local foi restaurada após revisão P3. Fechamento e evidência visual no [registro transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md); nenhuma execução manual/aparelho físico foi inferida.

### Fechamento local confirmado

Reteste específico dos dois cenários de navegação aprovado: computador em 23,4 segundos e celular em 17,3 segundos (rodada de aproximadamente 1,2 minuto). O conjunto de 26 casos únicos fecha com **25 aprovados e um ignorado intencional**, consolidando 23 aprovações da rodada anterior e as duas falhas de aliases corrigidas/retestadas. Não houve uma única rodada com 26 aprovações; falhas e retestes permanecem preservados neste registro e no histórico de resultados. O ignorado corresponde ao painel de perfil desktop, intencionalmente ausente no celular.

Tipos finais v3.5.0, build final webpack, vinte testes públicos e sete testes pgTAP locais aprovados; cinco verificadores do Atlas aprovados. [Galeria v3.5.0 com aplicativo real](../../wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela_01-tela_05-tela_12-tela_13-tela_14-tela_18-tela_66-tela_73/index.html#aplicativo-real): dezoito capturas reais (duas anteriores e dezesseis posteriores) e 36 capturas do Atlas, totalizando 54 imagens. A galeria distingue antes/depois, aplicativo/Atlas e seus limites; não certifica aparelho físico ou Safari. Publicação Git será registrada pelo agente principal no estado canônico. Deploy e aplicação remota da migração continuam sem comprovação; os 24 casos novos de caixa preta permanecem Não executados pelo usuário.
