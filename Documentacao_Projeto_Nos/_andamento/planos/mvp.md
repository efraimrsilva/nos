# MVP e caminho de implementação — Projeto Nós

**Versão de referência:** v0.14.0. **Aprovado pelo usuário:** 2026-10-12. **Status:** roteiro aprovado; funcionalidades futuras permanecem planejadas.

A [guia MVP do Atlas vivo](../../wireframes/atlas/index.html#mvp) orienta a prioridade das próximas entregas. A [Visão global](../../wireframes/atlas/index.html#visao-global) orienta a navegação do produto; a ordem de desenvolvimento não obriga a pessoa a percorrer todas as telas. Antes de codificar, inspecionar a tela no modo vivo com prioridade alta, ler ficha/contrato e conferir permissões.

## Primeiro marco utilizável

Permitir que duas pessoas entrem, compartilhem um Núcleo, proponham um Hábito, aceitem o teste, registrem a prática e decidam continuar, ajustar ou encerrar. Agenda interna, privacidade, segurança da conta, suporte e saída completam o piloto web. As etapas 01–05 reúnem 37 telas/estados, incluindo bases já implementadas; não são 37 páginas novas a construir.

Login existente é o início. Reconferir cadastro/confirmação, recuperação/revogação e retorno de convite antes de ampliar. A apresentação afetiva da Tela 72 é opcional. O MVP não depende de login social, calendário externo, aplicativo nativo ou IA.

## Sequência aprovada e cobertura

| Etapa | Entrega | Telas na etapa | Marco |
|---|---|---|---|
| 01 | Login, sessão, cadastro, confirmação, recuperação e entrada opcional | 01, 02, 03, 04, 05, 72 | MVP |
| 02 | Núcleo compartilhado, lista, criação, código de convite, gestão/revogação e Início | 12, 06, 07, 08, 09, 10, 11, 58, 59, 13 | MVP |
| 03 | Proposta de Hábito, respostas, teste, prática, histórico, confirmação e revisão | 18, 22, 23, 24, 27, 25, 29, 28, 30, 31, 32, 33 | MVP |
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
