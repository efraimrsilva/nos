# Fidelidade visual e manutenção do atlas

Referência funcional: **v0.12.0**. Conta e entrada sincronizadas em 2026-10-07; base histórica preservada.

## Procedência e precedência

**Visão global compartilha a fonte:** index.html carrega global-view.js/global-view.css; tileHtml e productPhoneHtml desenham as mesmas telas nas visões por áreas e global. screens.js fornece títulos, situação, dependências, ações e percursos. A ordem de leitura só referencia IDs e preserva caminhos alternativos; não mantém uma segunda versão da interface. Qualquer alteração confere impacto e sincroniza atlas/produto, acrescentando galeria conforme o [procedimento permanente](GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente). [Comparação da nova visão](comparacoes/2026-10-07-visao-global/index.html).

**Prioridade alta do Atlas vivo:** sua composição é a referência visual obrigatória de todas as implementações e alterações de tela. Inspecionar o aspecto antes de codificar, confrontar o resultado real antes de entregar e manter o desenho sincronizado. O modo histórico preserva a comparação; não substitui a direção viva. Seguir o [procedimento](GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05), incluindo contratos e pendências.

O atlas incorpora as 28 telas de Nos_App.dc.html em 52 layouts/variações estáticos. São 41 pontos de acesso à composição histórica, além de abas e nove escolhas de vínculo. A entrada do aplicativo tem 12 composições próprias; /comecar, /comecar/tipo e /comecar/convite foram comparadas ao servidor local. A ordem continua Conta primeiro.

| Base da composição viva | Quantidade | Regra |
|---|---:|---|
| Aplicativo: Conta e onboarding | 12 | Reproduzir código e interação local da entrada; não redesenhar por preferência. |
| Documento aprovado, com adaptação de contratos | 32 | Preservar hierarquia, ícones, cores e abas; atualizar regras, dados e permissões. |
| Extensões do inventário | 28 | Seguir identidade e contexto aprovados; verificar decisões pendentes antes de implementar. |

As três categorias totalizam 72 desenhos. Não equivalem a 72 rotas ou funcionalidades concluídas. A composição web de Conta/onboarding existe; o documento aprova telas móveis e a adaptação web dos demais módulos continua pendente.

## Identidade conferida

| Token | Cor |
|---|---|
| Canvas | #F6F3EB |
| Floresta | #2E4A20 |
| Folha | #4F7E2C |
| Texto secundário | #69725E |
| Contorno | #E6E3D8 |
| Lilás | #6A3FD1 |

Cores contextuais rosa, azul, pêssego, amarelo e lavanda permanecem nos ícones e cartões do documento. Fredoka e Plus Jakarta Sans são locais, com pesos correspondentes. Os SVG dos nove tipos usam Lucide 1.48.0, a mesma versão instalada. A árvore vem do ativo aprovado existente.

## Inventário por origem visual

| Tela | Composição viva | Referência histórica |
|---|---|---|
| [01 — Conta](atlas/index.html#tela-01) | Aplicativo implementado | Disponível na inspeção |
| [02 — Criar conta](atlas/index.html#tela-02) | Aplicativo implementado | Disponível na inspeção |
| [03 — Confirmar e-mail](atlas/index.html#tela-03) | Aplicativo implementado | Comparação antes/depois disponível |
| [04 — Recuperar acesso](atlas/index.html#tela-04) | Aplicativo implementado | Comparação antes/depois disponível |
| [05 — Redefinir senha](atlas/index.html#tela-05) | Aplicativo implementado | Comparação antes/depois disponível |
| [06 — Escolher caminho](atlas/index.html#tela-06) | Aplicativo implementado | Disponível na inspeção |
| [07 — Tipo de Núcleo](atlas/index.html#tela-07) | Aplicativo implementado | Disponível na inspeção |
| [08 — Propósito do Núcleo](atlas/index.html#tela-08) | Aplicativo implementado | Disponível na inspeção |
| [09 — Convite inicial](atlas/index.html#tela-09) | Aplicativo implementado | Disponível na inspeção |
| [10 — Inserir convite](atlas/index.html#tela-10) | Aplicativo implementado | Disponível na inspeção |
| [11 — Aceitar convite](atlas/index.html#tela-11) | Aplicativo implementado | Disponível na inspeção |
| [12 — Seus Núcleos](atlas/index.html#tela-12) | Documento com contratos atualizados | Disponível na inspeção |
| [13 — Início do Núcleo](atlas/index.html#tela-13) | Documento com contratos atualizados | Disponível na inspeção |
| [14 — Agenda do Núcleo](atlas/index.html#tela-14) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [15 — Detalhe do evento](atlas/index.html#tela-15) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [16 — Novo evento](atlas/index.html#tela-16) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [17 — Editar evento](atlas/index.html#tela-17) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [18 — Acordos](atlas/index.html#tela-18) | Documento com contratos atualizados | Disponível na inspeção |
| [19 — Novo acordo · necessidade](atlas/index.html#tela-19) | Documento com contratos atualizados | Disponível na inspeção |
| [20 — Novo acordo · proposta](atlas/index.html#tela-20) | Documento com contratos atualizados | Disponível na inspeção |
| [21 — Novo acordo · compreensão](atlas/index.html#tela-21) | Documento com contratos atualizados | Disponível na inspeção |
| [22 — Novo acordo · conferir](atlas/index.html#tela-22) | Documento com contratos atualizados | Disponível na inspeção |
| [23 — Aprovações](atlas/index.html#tela-23) | Documento com contratos atualizados | Disponível na inspeção |
| [24 — Detalhe do Hábito](atlas/index.html#tela-24) | Documento com contratos atualizados | Disponível na inspeção |
| [25 — Histórico do Hábito](atlas/index.html#tela-25) | Documento com contratos atualizados | Disponível na inspeção |
| [26 — Reflexões do Hábito](atlas/index.html#tela-26) | Documento com contratos atualizados | Disponível na inspeção |
| [27 — Registrar momento](atlas/index.html#tela-27) | Documento com contratos atualizados | Disponível na inspeção |
| [28 — Confirmar após teste](atlas/index.html#tela-28) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [29 — Definir teste do legado](atlas/index.html#tela-29) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [30 — Revisar Hábito](atlas/index.html#tela-30) | Documento com contratos atualizados | Disponível na inspeção |
| [31 — Propor ajuste](atlas/index.html#tela-31) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [32 — Propor encerramento](atlas/index.html#tela-32) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [33 — Acompanhar revisão](atlas/index.html#tela-33) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [34 — Detalhe de experiência](atlas/index.html#tela-34) | Documento com contratos atualizados | Disponível na inspeção |
| [35 — Registrar experiência](atlas/index.html#tela-35) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [36 — Nossa Essência](atlas/index.html#tela-36) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [37 — Promover para Essência](atlas/index.html#tela-37) | Documento com contratos atualizados | Disponível na inspeção |
| [38 — Nossa Árvore](atlas/index.html#tela-38) | Documento com contratos atualizados | Disponível na inspeção |
| [39 — Marcos e celebrações](atlas/index.html#tela-39) | Documento com contratos atualizados | Disponível na inspeção |
| [40 — Memórias](atlas/index.html#tela-40) | Documento com contratos atualizados | Disponível na inspeção |
| [41 — Detalhe da memória](atlas/index.html#tela-41) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [42 — Galeria de fotos](atlas/index.html#tela-42) | Documento com contratos atualizados | Disponível na inspeção |
| [43 — Demonstrar gratidão](atlas/index.html#tela-43) | Documento com contratos atualizados | Disponível na inspeção |
| [44 — Conexões](atlas/index.html#tela-44) | Documento com contratos atualizados | Disponível na inspeção |
| [45 — Perfil de membro](atlas/index.html#tela-45) | Documento com contratos atualizados | Disponível na inspeção |
| [46 — Gostos do membro](atlas/index.html#tela-46) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [47 — Tipos de vínculo](atlas/index.html#tela-47) | Documento com contratos atualizados | Disponível na inspeção |
| [48 — Nossa jornada](atlas/index.html#tela-48) | Documento com contratos atualizados | Disponível na inspeção |
| [49 — Meu perfil](atlas/index.html#tela-49) | Documento com contratos atualizados | Disponível na inspeção |
| [50 — Perfil · maturidade e opções](atlas/index.html#tela-50) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [51 — Sobre mim](atlas/index.html#tela-51) | Documento com contratos atualizados | Disponível na inspeção |
| [52 — Gostos, cuidado e datas](atlas/index.html#tela-52) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [53 — Editar perfil afetivo](atlas/index.html#tela-53) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [54 — Lista de desejos](atlas/index.html#tela-54) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [55 — Nosso manifesto](atlas/index.html#tela-55) | Documento com contratos atualizados | Disponível na inspeção |
| [56 — Revisar manifesto](atlas/index.html#tela-56) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [57 — Compartilhar manifesto](atlas/index.html#tela-57) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [58 — Convidar para o Núcleo](atlas/index.html#tela-58) | Documento com contratos atualizados | Disponível na inspeção |
| [59 — Gerenciar convites](atlas/index.html#tela-59) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [60 — Notificações](atlas/index.html#tela-60) | Documento com contratos atualizados | Disponível na inspeção |
| [61 — Conversa de cuidado](atlas/index.html#tela-61) | Documento com contratos atualizados | Disponível na inspeção |
| [62 — Ponte do Nós](atlas/index.html#tela-62) | Documento com contratos atualizados | Disponível na inspeção |
| [63 — Cartão de Intenção](atlas/index.html#tela-63) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [64 — Marcar conversa ao vivo](atlas/index.html#tela-64) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [65 — Depois da conversa](atlas/index.html#tela-65) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [66 — Configurações](atlas/index.html#tela-66) | Documento com contratos atualizados | Disponível na inspeção |
| [67 — Privacidade e visibilidade](atlas/index.html#tela-67) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [68 — Preferências de notificações](atlas/index.html#tela-68) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [69 — Conta e segurança](atlas/index.html#tela-69) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [70 — Ajuda e suporte](atlas/index.html#tela-70) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [71 — Sair de um Núcleo](atlas/index.html#tela-71) | Extensão coerente com identidade | Consultar módulo de origem e ficha |
| [72 — Entrada afetiva opcional](atlas/index.html#tela-72) | Aplicativo implementado, apresentação opcional | Desenho histórico preservado |

## Atualização reproduzível

Na raiz nos, com dependências já instaladas:

```powershell
node Documentacao_Projeto_Nos/wireframes/tools/import-approved.mjs
node Documentacao_Projeto_Nos/wireframes/tools/verify-fidelity.mjs
```

O primeiro comando lê o HTML aprovado, resolve suas condições/listas, gera approved-layouts.js e SVG locais e copia os pesos/licenças das fontes instaladas. Não editar esse arquivo gerado à mão. A fonte é registrada por SHA-256; mudança da fonte exige reimportação e inspeção. O segundo comando usa o aplicativo local em http://127.0.0.1:3000 para comparar as três rotas públicas; abrir esse servidor antes de executar. Capturas e resultado ficam em artifacts/, fora do commit.

Atualizar product-ui.js/product.css quando a implementação mudar; atualizar screens.js, fichas, cobertura e jornadas junto ao contrato. O documento original preserva sua origem; o modo vivo adapta regras sem adulterar a fonte. Não promover indicadores históricos a regra de produto.

## Validação de 2026-10-04

72 telas, 173 saídas, 360 estados, 41 referências, 52 layouts de 28 telas; três paletas/títulos reais e nove tipos/descrições/SVG conferidos. Rascunho, convite, abas, vínculos, teclado, filtros, 12 percursos, 375px, composição web, movimento reduzido e impressão CSS verificados. Zero erros de execução e zero chamadas HTTP externas no atlas. Revisão independente e reconferência dos achados concluídas.

Não houve alteração ou nova validação funcional de banco, autenticação ou produto; o wireframe não executa persistência. Nenhuma exportação de PDF. As 45 telas planejadas e extensões dos 27 recortes existentes permanecem sinalizadas no [inventário de pendências](COBERTURA.md).

A área Conta e entrada inclui também ID72. A versão viva apresenta somente botões implementados de cadastro/login; login social e consentimento jurídico históricos não foram ativados. [Comparação](comparacoes/2026-10-07-conta-entrada/index.html).


## Validação vigente — 2026-10-07 — v0.12.0

72 telas, 178 saídas, 360 estados, 41 referências e 13 percursos aprovados; zero erros de execução e chamadas externas no atlas. As seis telas de Conta e entrada foram comparadas ao aplicativo em duas larguras. Jornada funcional real validada separadamente no Supabase local, além dos 108 testes, tipos e build. Inventário atual: 42 telas planejadas e 30 recortes existentes. A validação de 2026-10-04 acima permanece como evidência histórica.
