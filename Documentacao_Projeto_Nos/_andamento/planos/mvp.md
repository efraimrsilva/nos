# MVP e caminho de implementação — Projeto Nós

**Atualização implementada localmente — v1.0.0 — 14/10/2026:** [contrato administrativo](../funcionalidades/administracao-participacao.md) substitui votação coletiva do ciclo de acordos e as decisões posteriores de votação por saída. Administração/participação entram no fechamento MVP05; gestão/revisão administrativa substitui consenso no comportamento-alvo de propósito e acordos. Percursos/fichas, aplicativo e migração local estão sincronizados:73 telas,39 recortes e34 planejadas. [Manual atual](../funcionalidades/administracao-manual.md). Publicação, migração remota, termos/política completos e operação do piloto permanecem pendentes. O roteiro abaixo conserva os marcos históricos; para Núcleos/acordos, prevalece o contrato administrativo.

**Versão de referência atual:** v1.0.0. **Aprovado pelo usuário:** 2026-10-12. **Status:** roteiro aprovado; funcionalidades futuras permanecem planejadas.

**Operação da etapa 01 em 13/10/2026:** conexão/login/sessão/saída verificados em https://noslife.netlify.app, com configuração de produção e retornos Supabase aplicados. Cadastro com confirmação externa ainda depende da senha de aplicativo Gmail; recuperação completa também exige segredo no Netlify. Etapa 01 continua aberta. [Registro online](../registros/registro-v0.14.1-2026-10-13-03-imp-conexao-netlify-fun-acesso-online.md).

A [guia MVP do Atlas vivo](../../wireframes/atlas/index.html#mvp) orienta a prioridade das próximas entregas. A [Visão global](../../wireframes/atlas/index.html#visao-global) orienta a navegação do produto; a ordem de desenvolvimento não obriga a pessoa a percorrer todas as telas. Antes de codificar, inspecionar a tela no modo vivo com prioridade alta, ler ficha/contrato e conferir permissões.

## Primeiro marco utilizável

Permitir que duas pessoas entrem, compartilhem um Núcleo, proponham um Hábito, aceitem o teste, registrem a prática e decidam continuar, ajustar ou encerrar. Agenda interna, privacidade, segurança da conta, suporte e saída completam o piloto web. As etapas 01–05 reúnem 37 telas/estados, incluindo bases já implementadas; não são 37 páginas novas a construir.

Login existente é o início. Reconferir cadastro/confirmação, recuperação/revogação e retorno de convite antes de ampliar. A apresentação afetiva da Tela 72 é opcional. O MVP não depende de login social, calendário externo, aplicativo nativo ou IA.

## Sequência aprovada e cobertura

| Etapa | Entrega | Telas na etapa | Marco |
|---|---|---|---|
| 01 | Login, sessão, cadastro, confirmação, recuperação e entrada opcional | 01, 02, 03, 04, 05, 72 | MVP |
| 02 | Núcleo compartilhado, lista, criação, código de convite, gestão/revogação e Início | 12, 06, 07, 08, 09, 58, 59, 10, 11, 13 | MVP |
| 03 | Proposta de Hábito, respostas, teste, prática, histórico, confirmação e revisão | 18, 22, 23, 24, 27, 25, 28, 29, 30, 31, 32, 33 | MVP |
| 04 | Agenda interna, evento, presença, edição e remoção | 14, 16, 15, 17 | MVP |
| 05 | Configurações essenciais, privacidade, conta, ajuda e saída | 66, 67, 69, 70, 71 | Fechamento do MVP |
| 06 | Proposta guiada, compreensão, reflexões, Impacto, Linguagens de cuidado e Experiências; agenda mensal/recorrência | 19, 20, 21, 26, 34, 35 | Expansão |
| 07 | Essência, Árvore, marcos, celebrações e evolução administrativa/propósito do Núcleo | 36, 37, 38, 39 | Expansão |
| 08 | Memórias, galeria, mídia protegida e gratidão | 40, 42, 41, 43 | Expansão |
| 09 | Perfil, opções, gostos, desejos, conexões, tipos de vínculo e jornada | 49, 50, 51, 52, 53, 54, 44, 45, 46, 47, 48 | Expansão |
| 10 | Manifesto, versões, aceites e compartilhamento autorizado | 55, 56, 57 | Expansão |
| 11 | Notificações, canais, preferências e eventos dos módulos | 60, 68 | Expansão |
| 12 | Conversa de cuidado, Ponte, cartão único, encontro restrito e desfecho | 61, 62, 63, 64, 65 | Expansão |
| 13 | QR/link/câmera, login Google/Apple, calendários externos, Android → iOS, biometria, IA opcional e operação | Refinar telas anteriores; sem ID fictício novo | Conclusão do projeto |

As 72 telas atuais têm uma etapa principal, sem duplicação. As funcionalidades transversais da etapa 13 refinam telas já relacionadas. Administração/revisão anual consensual do propósito entram na 07. QR/link/câmera entram na 13, com alternativa por código e sem associação automática.

Objetivos, funcionalidades detalhadas, dependências e critérios de avanço ficam na guia viva, definidos em [mvp-plan.js](../../wireframes/atlas/mvp-plan.js). Fichas, situações e ações vêm de [screens.js](../../wireframes/atlas/screens.js); desenhos reutilizam a renderização do atlas. Este documento registra a aprovação e a síntese, sem manter outra coleção de interfaces. Agenda pode avançar após o Núcleo; respeitar dependências explícitas, não apenas a numeração.

## Critérios de fechamento

Cada recorte deve concluir sua jornada com dados reais, validação de permissões, retornos e estados vazio/carregando/erro/sucesso. Testar celular/web, teclado, movimento reduzido, isolamento entre Núcleos e falhas reais. Atualizar aplicativo, Atlas, MVP, fichas, percursos, cobertura e comparações no mesmo conjunto lógico.

MVP fecha somente com fluxo central compartilhado, saída/revogação, tratamento de dados e operação do piloto comprovados. SMTP/recebimento externo, origem HTTPS, segredos do ambiente e backup/restauração exigem evidência própria. Teste local não certifica lançamento público.

Preservar unanimidade inicial/legado/ajustes/encerramento. Somente confirmação pós-teste usa mais da metade até 150 participantes ou um terço arredondado para cima acima de 150, mantendo conjunto original; silêncio não é voto. Essência, crescimento e manifesto não surgem automaticamente. Conversa de cuidado permanece privada e estruturada, sem chat livre.

Aprovação deste roteiro não fecha contratos ainda abertos, nem autoriza implementar/persistir todas as funções de uma vez. Cada solicitação delimita o próximo recorte. O projeto só estará completo quando pendências, ações, integrações e plataformas tiverem comportamento e operação comprovados; contagem de telas não mede conclusão.

## Manutenção e retomada

Ao criar/remover uma tela, revisar sua etapa e dependências. O aviso de cobertura do MVP sinaliza IDs novos, ausentes ou duplicados; resolvê-lo antes de declarar o roteiro completo. Mudanças de regra/visual devem atualizar a ficha e o desenho vivo, que alimentam as três visões. Mudanças de prioridade atualizam mvp-plan.js e esta síntese.

Próximo passo aprovado de planejamento: etapa 01, reconferir login/recuperação/retorno e limites operacionais, aproveitando implementações atuais. Necessidade/compreensão 19–21 e Nossa Árvore permanecem previstas nas etapas 06/07; as indicações anteriores de começar por esses módulos ficam substituídas como prioridade geral. Não iniciar nova funcionalidade nesta entrega de documentação/publicação.

[Registro e evidências](../registros/registro-v0.14.0-2026-10-12-imp-mvp-atlas-fun-roteiro-aprovado.md) · [Procedimento central](../../wireframes/GUIA.md#mvp-aprovado--prioridade-e-manutenção-do-roteiro).


## Etapa 01 — conferência em 13/10/2026 — v0.14.1

As seis telas e funções de acesso foram reconferidas localmente. P2 de falha de serviço/limite tratado e testado. Tipos/build, 100 testes gerais e jornada real local de cadastro/confirmação/recuperação/revogação aprovados. O critério operacional permanece aberto: Google ainda não liberou senha de aplicativo; ativar SMTP Gmail e comprovar recebimento externo, retorno e configuração do ambiente de uso. A preparação -Check foi validada sem alterações remotas. Prioridade continua etapa 01 até encerrar essa dependência. [Registro](../registros/registro-v0.14.1-2026-10-13-imp-acesso-existente-fun-mvp-etapa-01.md).


## Etapa 02 — conferência em 13/10/2026 — v0.15.0

Recorte funcional local concluído com gestão/revogação privada do criador, datas/filtros/paginação, cópia e concorrência protegida. Criador segue lista → tipo/propósito → criação → convite/compartilhamento → Início; gestão é opcional. Convidado segue código → prévia → aceite → Início → lista. Publicar/aplicar migração e comprovar ambiente online ainda pendentes; etapa 01 segue operacionalmente aberta. QR/link/destinatários/administradores/histórico por aceite reservados. [Contrato](../funcionalidades/nucleo-compartilhado.md), [plano executado](mvp-02-nucleo.md), [registro](../registros/registro-v0.15.0-2026-10-13-imp-nucleo-compartilhado-fun-mvp-02-gestao-convites.md).

## Etapa 03 — conferência em 13/10/2026 — v0.15.1

Ciclo central validado localmente: proposta → teste → prática/histórico → confirmação; legado é alternativa, ajuste e encerramento são ramificações. Histórico de revisões paginado, pendência visível, leitura concorrente corrigida. Duas contas desktop/mobile, quatro originais/externo/legado e testes SQL aprovados; futuras expansões explicitadas. Publicação/prova online pendentes; etapas 01/02 continuam com suas dependências operacionais. [Contrato/manual](../funcionalidades/ciclo-habito.md), [plano](mvp-03-habito.md), [registro](../registros/registro-v0.15.1-2026-10-13-imp-ciclo-habito-fun-mvp-03.md). Próximo recorte funcional é etapa 04, quando solicitado.

## Etapa04 — conferência em13/10/2026 — v0.15.2

Agenda14 → Novo16 → Evento/respostas15 → edição17 opcional → agenda14; são seções da mesma rota. Recorte funcional local validado com duas contas desktop/mobile: criação/presença/remarcação, autorização, paginação e remoção contextual confirmada; manter não grava. Mês/recorrência/local/terceira resposta/seleção individual/notificações/memórias/integrações reservados.102 gerais e seis autenticados aprovados. Sem nova migração; publicação/prova online pendentes. Próximo recorte funcional é MVP05, quando solicitado; etapas01/02 seguem com suas dependências operacionais. [Contrato/manual](../funcionalidades/agenda-interna.md), [plano](mvp-04-agenda.md), [registro](../registros/registro-v0.15.2-2026-10-13-imp-agenda-interna-fun-mvp-04.md).

## Etapa 05 — conferência em 13/10/2026 — v0.16.0

Recorte local de orientação concluído; etapa parcial. Lista/Início→66;67/69/70 alternativas;13→71→13 contextual. Sem remoção/transferência/exclusão/preferências simuladas.106 testes gerais produção, quatro autenticados, tipos/build/Atlas e revisão aprovados. Saída/transferência/retenção/direitos/suporte/termos e operação continuam necessários para fechar o MVP. [Contrato](../funcionalidades/autonomia-protecao.md), [registro](../registros/registro-v0.16.0-2026-10-13-imp-controles-autonomia-fun-mvp-05.md).
