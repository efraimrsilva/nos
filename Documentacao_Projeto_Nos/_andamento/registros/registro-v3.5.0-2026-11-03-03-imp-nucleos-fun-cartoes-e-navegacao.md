# Registro — v3.5.0 — 2026-11-03 — Imp. de Núcleos com Fun. cartões e navegação

- **Versão:** 3.5.0, integrante da consolidação MINOR.
- **Status:** Concluído e validado localmente — publicação Git sob controle do estado canônico; sem certificação de deploy ou migração remota.
- **Objetivo/contexto:** simplificar a escolha de Núcleo, tornar pessoas e contexto reconhecíveis e consolidar a limpeza visual solicitada.
- **Requisitos:** cartão inteiro acionável, integrantes reais, largura/colunas adaptadas, altura natural, remoção do cartão Um lugar à mesa e da exposição visual de propósito; identidade do Núcleo no Início da navegação.

## Decisões e integrações

Cada cartão de `/nucleos` é um link com tipo, nome e integrantes. Usa `get_nucleus_management` com a sessão atual, uma consulta por Núcleo da página (até vinte), executadas em paralelo; erro não se transforma em pessoas ilustrativas. A lista de pessoas possui rolagem interna quando exceder seu limite visual. O nome mantém título completo, apresentação até duas linhas; iniciais reutilizam `profileLetters`.

Cartões têm 300 pixels a partir de 1200 pixels; duas colunas entre 600 e 1199; uma até 599, com altura automática. Foco visível, elevação sutil e preferência por movimento reduzido são preservados. O cartão Um lugar à mesa deixa a lista e Pessoas, mantendo caminhos de convite apropriados. Propósito deixa de ser exibido no cartão e no cabeçalho do Início, sem apagar o dado/gestão. Links de rodapé específicos da Home e separadores finais dos cartões foram retirados.

Início da barra lateral/inferior acrescenta nome do Núcleo atual, com abreviação visual de 18 caracteres no computador e 12 no celular, reticências e nome completo acessível. A versão é lida de `package.json` e exibida após Sua conta, na lateral e em Mais, sem divisor inferior.

## Arquivos e documentação

`src/app/nucleos/page.tsx`, `src/app/nucleos/[id]/page.tsx`, `src/app/nucleos/[id]/pessoas/page.tsx`, `src/app/layout-system.css`, `src/shared/components/application-shell.tsx`; testes autenticados de seleção/layout/navegação/barra lateral e convites atualizados. [Contrato de Núcleos](../funcionalidades/nucleo-compartilhado.md), [navegação](../funcionalidades/navegacao-sessao.md), casos M02-LAY-004–006 em [Núcleos](../testes-caixa-preta/nucleos-layout.md) e NAV-AJU-001–004 no [roteiro transversal](../testes-caixa-preta/ajustes-v3-5.md).

## Validação, resultado e limites

Rodada anterior informada na sessão: onze cenários de movimento da conta/seleção de Núcleo aprovados e um ignorado porque o painel desktop não existe no celular por decisão de interface. A reexecução final e a auditoria de nome longo no cabeçalho estão sendo concluídas pelo agente principal. Não usar esse resultado anterior como prova de toda a paridade atual.

Todos os casos de caixa preta novos permanecem Não executados pelo usuário. Consulta de integrantes reaproveita autorização existente, sem migração nova para cartões. Próximo passo: concluir correção/validação do nome longo no cabeçalho, conferir Atlas/galeria e completar o [registro transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md).

### Verificação final da v3.5.0

Os quatro cenários de paridade passaram: nomes de oitenta caracteres sem espaços nas larguras de 320 a 1440 pixels, destinos equivalentes, modais em 320/390/768/1440 pixels e reserva inferior com área segura de 34 pixels simulada. As correções incluem cabeçalho/breadcrumb, texto de navegação, títulos de diálogos, resumos de cartões e `.home-space summary`/nomes da lista. Não há evidência de aparelho físico. Rodada autenticada atual: 23 aprovados, duas falhas de expectativas antigas de navegação para Conta e um ignorado em 2,3 minutos; reteste dos dois casos com URLs/hashes canônicos está em execução. Tipos/build finais e cinco verificadores do Atlas passaram; busca local do Atlas restaurada após revisão P3. Publicação/galeria serão registradas no [fechamento transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md).

### Fechamento local confirmado

Reteste específico dos dois cenários de navegação aprovado: computador em 23,4 segundos e celular em 17,3 segundos (rodada de aproximadamente 1,2 minuto). O conjunto de 26 casos únicos fecha com **25 aprovados e um ignorado intencional**, consolidando 23 aprovações da rodada anterior e as duas falhas de aliases corrigidas/retestadas. Não houve uma única rodada com 26 aprovações; falhas e retestes permanecem preservados neste registro e no histórico de resultados. O ignorado corresponde ao painel de perfil desktop, intencionalmente ausente no celular.

Tipos finais v3.5.0, build final webpack, vinte testes públicos e sete testes pgTAP locais aprovados; cinco verificadores do Atlas aprovados. [Galeria v3.5.0 com aplicativo real](../../wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela_01-tela_05-tela_12-tela_13-tela_14-tela_18-tela_66-tela_73/index.html#aplicativo-real): dezoito capturas reais (duas anteriores e dezesseis posteriores) e 36 capturas do Atlas, totalizando 54 imagens. A galeria distingue antes/depois, aplicativo/Atlas e seus limites; não certifica aparelho físico ou Safari. Publicação Git será registrada pelo agente principal no estado canônico. Deploy e aplicação remota da migração continuam sem comprovação; os 24 casos novos de caixa preta permanecem Não executados pelo usuário.
