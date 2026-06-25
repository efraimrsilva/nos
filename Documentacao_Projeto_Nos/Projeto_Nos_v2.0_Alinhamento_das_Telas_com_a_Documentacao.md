# Projeto Nós - Alinhamento das Telas com a Documentação (Versão 1.9)

## Status

Documento de consolidação inicial

## Objetivo

Comparar as 28 telas do protótipo com a documentação existente do Projeto Nós e registrar o que já está coberto, o que foi refinado pelas telas e o que ainda precisa ser documentado em detalhe.

Este documento serve como ponte entre a documentação conceitual atual e a próxima etapa: documentação completa de todas as telas, fluxos, componentes, estados e regras de interface.

---

# 1. Síntese da Comparação

## O que a documentação já cobre bem

- Propósito do produto.
- Jornada de transformação de necessidades em acordos.
- Estrutura de Hábitos, Experiências e Nossa Essência.
- Evolução para Núcleos.
- Consenso e aprovação.
- Impacto esperado e percebido.
- Gratidão e reconhecimento.
- Marcos saudáveis.
- Linguagens de cuidado.
- Manifesto do Núcleo.

## O que as telas tornaram mais concreto

- Arquitetura inicial de navegação.
- Home do Núcleo.
- Árvore como metáfora central de evolução.
- Agenda e próximos momentos.
- Área de Memórias.
- Registro de momentos.
- Convites por código, QR e link.
- Perfil afetivo do usuário.
- Perfil de outro membro.
- Configurações de privacidade e notificações.
- Notificações positivas e de evolução.
- Estados visuais de acordos, revisão, promoção para Essência e conversa de cuidado.

## O que ainda precisa virar documentação própria

- Documentação tela a tela.
- Design system.
- Componentes reutilizáveis.
- Modelo de navegação.
- Estados vazios.
- Estados de erro.
- Estados de carregamento.
- Permissões e visibilidade por Núcleo.
- Modelo de dados inicial.
- Eventos de notificação.
- Regras de agenda.
- Regras de memória.
- Regras de perfil afetivo.
- Regras de compartilhamento.

---

# 2. Mapa das Telas do Protótipo

## Tela 1 - Abertura

Função: apresentar marca, slogan e entrada no app.

Elementos:

- árvore;
- nome Nós;
- slogan;
- botão Começar;
- botão Entrar;
- paisagem inferior.

Documentação relacionada:

- v1.1 Visão e Regras de Negócio.

## Telas 2 e 3 - Home do Núcleo

Função: resumir o estado afetivo e prático do Núcleo.

Elementos:

- saudação personalizada;
- seletor de Núcleo;
- notificações;
- card emocional;
- Nossa árvore;
- gratidão recente;
- agenda;
- próximos momentos.

Documentação relacionada:

- v1.1 Visão.
- v1.3 Núcleos.
- v1.5 Gratidão.
- v1.6 Marcos.

Lacuna:

- precisa de documentação própria da Home.

## Telas 4, 5, 6, 8, 22, 23 e 24 - Acordos

Função: criar, acompanhar, registrar, revisar, ajustar e promover acordos.

Elementos:

- lista de acordos;
- abas Hábitos, Experiências e Essência;
- filtros por status;
- detalhe do acordo;
- fluxo Novo acordo;
- revisão;
- promoção para Essência;
- conversa de cuidado.

Documentação relacionada:

- v1.2 Acordos.
- v1.4 Impacto.
- v1.7 Linguagens de Cuidado.

Lacuna:

- precisa de documentação detalhada do fluxo completo de acordos na interface.

## Tela 7 - Nossa Árvore

Função: visualizar evolução coletiva do Núcleo.

Elementos:

- árvore;
- nível;
- estágio;
- experiência;
- próximo estágio;
- hábitos cultivados;
- experiências vividas;
- valores na essência.

Documentação relacionada:

- v1.4 Impacto.
- v1.6 Marcos.

Lacuna:

- precisa de regras específicas de experiência, níveis e estágios.

## Tela 9 - Memórias

Função: preservar linha do tempo afetiva do Núcleo.

Elementos:

- filtros Tudo, Fotos, Agradecimentos e Marcos;
- gratidões;
- marcos;
- momentos registrados.

Documentação relacionada:

- v1.5 Gratidão.
- v1.6 Marcos.

Lacuna:

- precisa de documentação própria de Memórias.

## Telas 10, 11, 13, 14 e 18 - Núcleos e Convites

Função: gerenciar vínculos, trocar de Núcleo, convidar membros e aceitar convites.

Elementos:

- perfil do Núcleo;
- lista de Núcleos;
- maturidade;
- convite recebido;
- código de convite;
- QR code;
- convites pendentes;
- privacidade.

Documentação relacionada:

- v1.3 Núcleos.
- v1.8 Manifesto.

Lacuna:

- precisa de documentação detalhada de permissões, convites e papéis.

## Tela 12 - Cadastro

Função: criar conta com promessa de privacidade.

Elementos:

- nome;
- email;
- senha;
- mensagem de espaço privado;
- CTA continuar.

Documentação relacionada:

- v1.1 Visão.
- v1.3 Núcleos.

Lacuna:

- precisa de documentação de onboarding, autenticação e primeira experiência.

## Tela 15 - Notificações

Função: avisar sobre gratidões, acordos, entradas no Núcleo e marcos.

Elementos:

- agrupamento por tempo;
- notificações positivas;
- notificações de acordo;
- notificações de entrada;
- notificações de Essência.

Documentação relacionada:

- v1.5 Gratidão.
- v1.6 Marcos.
- v1.2 Acordos.

Lacuna:

- precisa de catálogo de notificações.

## Telas 16, 17 e 21 - Momentos, Gratidão e Experiências

Função: registrar práticas, agradecimentos e experiências planejadas ou vividas.

Elementos:

- sentimento do momento;
- nota;
- foto;
- destinatários;
- mensagem;
- sugestões;
- ideias para próxima experiência;
- agendamento.

Documentação relacionada:

- v1.5 Gratidão.
- v1.6 Marcos.
- v1.7 Linguagens.

Lacuna:

- precisa de documentação de registros de momento e agenda.

## Telas 19, 20, 27 e 28 - Perfil Afetivo

Função: ajudar membros a conhecerem melhor uns aos outros.

Elementos:

- vínculo;
- estatísticas relacionais;
- linguagens de cuidado;
- ideias de presente;
- gostos;
- lista de desejos;
- datas importantes;
- completude de perfil.

Documentação relacionada:

- v1.7 Linguagens de Cuidado.

Lacuna:

- precisa de documentação própria do perfil afetivo e lista de desejos.

## Tela 25 - Manifesto

Função: apresentar identidade afetiva confirmada do Núcleo.

Elementos:

- título afetivo;
- nome do Núcleo;
- texto manifesto;
- assinaturas;
- ação de compartilhar.

Documentação relacionada:

- v1.8 Manifesto do Núcleo.

## Tela 26 - Configurações

Função: controlar privacidade, notificações e conta.

Elementos:

- Núcleo privado;
- só por convite;
- memórias visíveis só ao Núcleo;
- gratidões e acordos;
- lembretes da agenda;
- editar perfil;
- ajuda e suporte.

Documentação relacionada:

- v1.3 Núcleos.
- v1.5 Gratidão.
- v1.8 Manifesto.

Lacuna:

- precisa de documentação de configurações e privacidade.

---

# 3. Decisões de Produto Derivadas das Telas

## Decisão 1 - Núcleo é o contexto principal

Todo conteúdo sensível deve estar associado a um Núcleo.

Isso inclui:

- acordos;
- memórias;
- gratidões;
- agenda;
- árvore;
- manifesto;
- membros;
- notificações;
- configurações.

## Decisão 2 - A árvore é o símbolo de evolução coletiva

A árvore deve aparecer como elemento de identidade e progresso do Núcleo.

Ela não deve representar desempenho individual.

## Decisão 3 - A Home precisa equilibrar cuidado e ação

A Home deve mostrar:

- acolhimento;
- estado atual do Núcleo;
- progresso simbólico;
- registro positivo recente;
- agenda próxima;
- acesso rápido às ações importantes.

## Decisão 4 - Memórias são uma camada transversal

Memórias devem reunir registros de:

- gratidão;
- fotos;
- momentos;
- marcos;
- experiências;
- celebrações.

## Decisão 5 - Perfil afetivo é parte do cuidado

O perfil não é apenas cadastro. Ele ajuda os membros a cuidarem melhor uns dos outros.

## Decisão 6 - Privacidade deve ser visível

O app deve reforçar em telas sensíveis que o Núcleo é privado e acessível apenas por convite.

## Decisão 7 - Revisão deve proteger o vínculo

Quando algo não está indo bem, a interface deve conduzir para conversa de cuidado, não cobrança.

---

# 4. Próximos Documentos Recomendados

## v2.0 - Arquitetura de Navegação e Home

Deve documentar:

- navegação principal;
- Home;
- árvore resumida;
- agenda;
- próximos momentos;
- ações rápidas.

## v2.1 - Documentação Completa de Acordos na Interface

Deve documentar:

- lista;
- filtros;
- detalhe;
- criação;
- registro de momento;
- revisão;
- conversa de cuidado;
- promoção para Essência.

## v2.2 - Memórias, Agenda e Experiências

Deve documentar:

- linha do tempo afetiva;
- filtros;
- tipos de memória;
- experiências recorrentes;
- momentos registrados;
- fotos.

## v2.3 - Núcleos, Convites e Permissões

Deve documentar:

- lista de Núcleos;
- criação;
- convite;
- aceite;
- membros;
- privacidade;
- troca de Núcleo.

## v2.4 - Perfil Afetivo e Preferências de Cuidado

Deve documentar:

- perfil próprio;
- perfil de outro membro;
- lista de desejos;
- gostos;
- datas;
- linguagens;
- completude.

## v2.5 - Design System do Projeto Nós

Deve documentar:

- cores;
- tipografia;
- botões;
- cards;
- abas;
- chips;
- ícones;
- estados;
- tom de voz;
- padrões de microcopy.

---

# 5. Observação Técnica

O PDF analisado possui 28 páginas em formato mobile vertical e aparenta ter sido exportado de uma página HTML/protótipo.

As telas devem ser tratadas como fonte de intenção de produto e UX, não necessariamente como especificação final pixel-perfect.

O próximo passo recomendado é documentar tela por tela com:

- objetivo;
- contexto;
- componentes;
- dados necessários;
- ações;
- regras;
- estados;
- navegação;
- dependências com outras funcionalidades.
