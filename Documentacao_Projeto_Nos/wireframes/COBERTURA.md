# Cobertura e pendências do wireframe

Material de planejamento criado em 2026-10-03 e corrigido visualmente em 2026-10-04. Referência funcional: v0.13.0. Atualização da área Conta e entrada em 2026-10-07.

## Situação verificada

**Visão global:** reutiliza os 72 desenhos e suas situações/pendências; o mapa não altera a classificação de implementação. Percursos e destinos vêm do inventário; ligações de contexto estão distinguidas de saídas previstas nas fichas. [Abrir mapa](atlas/index.html#visao-global) e seguir o [padrão de sincronização/comparações](GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente).

Conferência atualizada em 2026-10-07: as 72 fichas, situações e pendências coincidem com este inventário e com os rótulos visíveis nas miniaturas e na inspeção. Todos os 31 recortes existentes apontam para rotas presentes no código; isso não confirma as ampliações ilustradas. Os 41 desenhos planejados continuam identificados. **Antes de implementar qualquer tela, consultar seu aspecto no modo Atlas vivo com prioridade alta**, conforme o [procedimento obrigatório](GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05).

- 72 telas/estados; 8 áreas; 14 percursos.
- 41 telas planejadas e pendentes de implementação.
- 31 recortes existentes: o desenho pode incluir ampliações ainda pendentes, descritas individualmente.
- As 37 interfaces do catálogo v2.1 estão mapeadas. Continuação de página, aba e estado podem compartilhar rota; 72 desenhos não significam 72 rotas novas.

## Inventário completo

| Tela | Área | Nome | Situação | Origem v2.1 | Localização / rota | Pendência ou limite |
|---|---|---|---|---|---|---|
| 01 | Conta e entrada | [Conta](atlas/index.html#tela-01) | Recorte existente | 01, 12 | /conta · entrada / | Fluxo implementado; configuração SMTP, URLs autorizadas e limites remotos exigem validação no ambiente de publicação. |
| 02 | Conta e entrada | [Criar conta](atlas/index.html#tela-02) | Recorte existente | 12 | /conta · modo cadastro | Cadastro integrado e validado localmente; textos jurídicos e operação de e-mail de produção continuam fora desta seção. |
| 03 | Conta e entrada | [Confirmar e-mail](atlas/index.html#tela-03) | Recorte existente | Complemento de segurança | /conta/confirmar-email · /auth/confirm | Cadastro, reenvio e confirmação implementados; entrega local comprovada. SMTP e limites da hospedagem ainda exigem conferência. |
| 04 | Conta e entrada | [Recuperar acesso](atlas/index.html#tela-04) | Recorte existente | Complemento de segurança | /conta/recuperar · /auth/recovery | Recuperação integrada; AUTH_RECOVERY_SECRET, origem, URLs autorizadas e serviço de e-mail devem estar configurados no ambiente. |
| 05 | Conta e entrada | [Redefinir senha](atlas/index.html#tela-05) | Recorte existente | Complemento de segurança | /conta/nova-senha | Redefinição integrada; chave de assinatura somente no servidor. Link inválido, usado ou aberto sem verificador oferece reinício seguro. |
| 06 | Criar e entrar no Núcleo | [Escolher caminho](atlas/index.html#tela-06) | Recorte existente | 29 | /comecar | Tela protegida existente; Seus Núcleos é a entrada padrão após login. |
| 07 | Criar e entrar no Núcleo | [Tipo de Núcleo](atlas/index.html#tela-07) | Recorte existente | 30 | /comecar/tipo | Catálogo atual de nove tipos; manter identificador validado na URL. |
| 08 | Criar e entrar no Núcleo | [Propósito do Núcleo](atlas/index.html#tela-08) | Recorte existente | 31 | /comecar/proposito | Criação existente; sem persistência de rascunho no atlas. |
| 09 | Criar e entrar no Núcleo | [Convite inicial](atlas/index.html#tela-09) | Recorte existente | 32 | /comecar/convite-inicial/[id] | Código e compartilhamento nativo existentes; QR e gestão ampliada dependem de contrato. |
| 10 | Criar e entrar no Núcleo | [Inserir convite](atlas/index.html#tela-10) | Recorte existente | 18 · entrada complementar | /comecar/convite | Consulta existente, sem expor token ou dados privados antes da associação. |
| 11 | Criar e entrar no Núcleo | [Aceitar convite](atlas/index.html#tela-11) | Recorte existente | 18 | /comecar/convite · prévia | Aceite existente; fluxo idempotente no banco. |
| 12 | Criar e entrar no Núcleo | [Seus Núcleos](atlas/index.html#tela-12) | Recorte existente | 13 | /nucleos | Listagem, seleção, paginação, vazio, carregamento e erro implementados; cartões do atlas são exemplos identificados. |
| 13 | Início e agenda | [Início do Núcleo](atlas/index.html#tela-13) | Recorte existente | 02 | /nucleos/[id] | Home protegida existente; resumo afetivo completo depende de módulos futuros. |
| 14 | Início e agenda | [Agenda do Núcleo](atlas/index.html#tela-14) | Recorte existente | 03 | /nucleos/[id]/agenda | Agenda real existente; visão mensal e integração com experiências são planejadas. |
| 15 | Início e agenda | [Detalhe do evento](atlas/index.html#tela-15) | Recorte existente | Complemento da 03 | /nucleos/[id]/agenda · item existente | Operações existentes no hub da agenda; rota individual é evolução proposta. |
| 16 | Início e agenda | [Novo evento](atlas/index.html#tela-16) | Recorte existente | Complemento da 03 | /nucleos/[id]/agenda · formulário | Criação existente; campos devem respeitar esquema atual no desenvolvimento. |
| 17 | Início e agenda | [Editar evento](atlas/index.html#tela-17) | Recorte existente | Complemento da 03 | /nucleos/[id]/agenda · edição | Edição e remoção existentes; notificações de mudança pendentes. |
| 18 | Acordos e consentimento | [Acordos](atlas/index.html#tela-18) | Recorte existente | 04 | /nucleos/[id]/acordos | Hub real; fluxo em quatro etapas e módulos de Essência ainda planejados. |
| 19 | Acordos e consentimento | [Novo acordo · necessidade](atlas/index.html#tela-19) | Planejada | 08 | Proposta: /nucleos/[id]/acordos/novo · etapa 1 | Hub cria propostas; fluxo guiado completo ainda não existe. |
| 20 | Acordos e consentimento | [Novo acordo · proposta](atlas/index.html#tela-20) | Planejada | Fluxo v2.2 · etapa complementar | Proposta: /nucleos/[id]/acordos/novo · etapa 2 | Dados essenciais e prazo já existem no formulário atual; novo fluxo e seleção explícita pendentes. |
| 21 | Acordos e consentimento | [Novo acordo · compreensão](atlas/index.html#tela-21) | Planejada | Fluxo v1.10 / v2.2 | Proposta: /nucleos/[id]/acordos/novo · etapa 3 | Compreensão estruturada e fluxo assíncrono pendentes. |
| 22 | Acordos e consentimento | [Novo acordo · conferir](atlas/index.html#tela-22) | Planejada | Fluxo v2.2 · etapa complementar | Proposta: /nucleos/[id]/acordos/novo · etapa 4 | Criação existe no hub; tela de conferência é futura. |
| 23 | Acordos e consentimento | [Aprovações](atlas/index.html#tela-23) | Recorte existente | 36 | /nucleos/[id]/acordos · respostas / hub futuro | Respostas existentes no hub; central unificada ainda não implementada. |
| 24 | Acordos e consentimento | [Detalhe do Hábito](atlas/index.html#tela-24) | Recorte existente | 05, 06 | /nucleos/[id]/acordos/[agreementId] | Detalhe, registro, confirmação e revisão existem; reflexões/impacto/evento associado pendentes. |
| 25 | Acordos e consentimento | [Histórico do Hábito](atlas/index.html#tela-25) | Recorte existente | 05 · aba histórico | /nucleos/[id]/acordos/[agreementId] · histórico | Histórico real existente, com cursor; foto e memória geral ainda pendentes. |
| 26 | Acordos e consentimento | [Reflexões do Hábito](atlas/index.html#tela-26) | Planejada | 05 · aba reflexões | Proposta: detalhe do Hábito · reflexões | Persistência e privacidade das reflexões pendentes. |
| 27 | Acordos e consentimento | [Registrar momento](atlas/index.html#tela-27) | Recorte existente | 16 | /nucleos/[id]/acordos/[agreementId]/registrar | Humor e nota existentes; foto, registro de experiência e memória geral são futuros. |
| 28 | Acordos e consentimento | [Confirmar após teste](atlas/index.html#tela-28) | Recorte existente | Complemento v0.11.0 | /nucleos/[id]/acordos/[agreementId]/confirmar | Implementado na v0.11.0. Este cenário é ilustrativo e não executa votação. |
| 29 | Acordos e consentimento | [Definir teste do legado](atlas/index.html#tela-29) | Recorte existente | Complemento v0.11.0 | /nucleos/[id]/acordos/[agreementId]/confirmar · legado | Fluxo legado implementado; atlas reúne as etapas sem simular aprovação real. |
| 30 | Acordos e consentimento | [Revisar Hábito](atlas/index.html#tela-30) | Recorte existente | 22 | /nucleos/[id]/acordos/[agreementId]/revisar | Ajuste/encerramento existentes; conversa e Essência são futuras. |
| 31 | Acordos e consentimento | [Propor ajuste](atlas/index.html#tela-31) | Recorte existente | 22 · ajuste | /nucleos/[id]/acordos/[agreementId]/revisar · formulário | Contrato de revisão existente. |
| 32 | Acordos e consentimento | [Propor encerramento](atlas/index.html#tela-32) | Recorte existente | 22 · encerramento | /nucleos/[id]/acordos/[agreementId]/revisar · encerramento | Encerramento existente; campo de contexto exige conferência do contrato atual. |
| 33 | Acordos e consentimento | [Acompanhar revisão](atlas/index.html#tela-33) | Recorte existente | 22 · acompanhamento | /nucleos/[id]/acordos/[agreementId]/revisar · pendência | RPC agregada e aplicação explícita existentes. |
| 34 | Acordos e consentimento | [Detalhe de experiência](atlas/index.html#tela-34) | Planejada | 21 | Proposta: /nucleos/[id]/experiencias/[id] | Modelo de ocorrência, agenda e memória de experiência pendentes. |
| 35 | Acordos e consentimento | [Registrar experiência](atlas/index.html#tela-35) | Planejada | 16, 21 · extensão | Proposta: experiência/[id]/registrar | Registro de experiência e armazenamento de mídia não implementados. |
| 36 | Acordos e consentimento | [Nossa Essência](atlas/index.html#tela-36) | Recorte existente | 04 · aba Essência | /nucleos/[id]/acordos · Essência | Aba vazia existente; promoção e persistência de Essência pendentes. |
| 37 | Acordos e consentimento | [Promover para Essência](atlas/index.html#tela-37) | Planejada | 23 | Proposta: acordos/[id]/essencia | Essência, elegibilidade e consenso específicos pendentes. |
| 38 | Árvore e memórias | [Nossa Árvore](atlas/index.html#tela-38) | Planejada | 07 | Proposta: /nucleos/[id]/arvore | Próxima implementação prevista; contratos de crescimento ainda abertos. |
| 39 | Árvore e memórias | [Marcos e celebrações](atlas/index.html#tela-39) | Planejada | 07, 09 · v1.6 | Proposta: /nucleos/[id]/marcos | Regras de marcos, eventos e notificações pendentes. |
| 40 | Árvore e memórias | [Memórias](atlas/index.html#tela-40) | Planejada | 09 | Proposta: /nucleos/[id]/memorias | Feed unificado, fotos, gratidão e marcos pendentes. |
| 41 | Árvore e memórias | [Detalhe da memória](atlas/index.html#tela-41) | Planejada | 09 · detalhe complementar | Proposta: /nucleos/[id]/memorias/[id] | Entidade de memória e ações por autoria pendentes. |
| 42 | Árvore e memórias | [Galeria de fotos](atlas/index.html#tela-42) | Planejada | 09 · galeria complementar | Proposta: /nucleos/[id]/memorias/fotos | Armazenamento privado de mídia pendente. |
| 43 | Árvore e memórias | [Demonstrar gratidão](atlas/index.html#tela-43) | Planejada | 17 | Proposta: /nucleos/[id]/gratidao | Persistência, visibilidade e notificações de gratidão pendentes. |
| 44 | Conexões e perfis | [Conexões](atlas/index.html#tela-44) | Planejada | 35 | Proposta: /nucleos/[id]/conexoes | Modelo de vínculo, métricas e permissões pendentes. |
| 45 | Conexões e perfis | [Perfil de membro](atlas/index.html#tela-45) | Planejada | 19 | Proposta: /nucleos/[id]/membros/[id] | Perfil afetivo e leitura por contexto pendentes. |
| 46 | Conexões e perfis | [Gostos do membro](atlas/index.html#tela-46) | Planejada | 20 | Proposta: perfil do membro · continuação | Campos afetivos e regras por campo pendentes. |
| 47 | Conexões e perfis | [Tipos de vínculo](atlas/index.html#tela-47) | Planejada | 33 | Proposta: /nucleos/[id]/vinculos/novo | Modelo de vínculo e distinção do Núcleo pendentes. |
| 48 | Conexões e perfis | [Nossa jornada](atlas/index.html#tela-48) | Planejada | 34 | Proposta: /nucleos/[id]/vinculos/[id]/jornada | Modelo de fase e mudança consensual pendentes. |
| 49 | Conexões e perfis | [Meu perfil](atlas/index.html#tela-49) | Planejada | 10 | Proposta: /perfil | Perfil geral e afetivo pendentes; conta autenticada já existe. |
| 50 | Conexões e perfis | [Perfil · maturidade e opções](atlas/index.html#tela-50) | Planejada | 11 | Proposta: /perfil · continuação | Maturidade e perfil pendentes; logout existente em Conta. |
| 51 | Conexões e perfis | [Sobre mim](atlas/index.html#tela-51) | Planejada | 27 | Proposta: /perfil/sobre-mim | Modelo de perfil afetivo pendente. |
| 52 | Conexões e perfis | [Gostos, cuidado e datas](atlas/index.html#tela-52) | Planejada | 28 | Proposta: /perfil/sobre-mim · continuação | Persistência por campo e compartilhamento de datas pendentes. |
| 53 | Conexões e perfis | [Editar perfil afetivo](atlas/index.html#tela-53) | Planejada | 27, 28 · edição | Proposta: /perfil/editar | Esquema e regras de privacidade pendentes. |
| 54 | Conexões e perfis | [Lista de desejos](atlas/index.html#tela-54) | Planejada | 19, 27 · complemento | Proposta: /perfil/desejos | Desejos e visibilidade pendentes. |
| 55 | Manifesto e cuidado | [Nosso manifesto](atlas/index.html#tela-55) | Planejada | 25 | Proposta: /nucleos/[id]/manifesto | Geração, revisão, assinaturas e versões pendentes. |
| 56 | Manifesto e cuidado | [Revisar manifesto](atlas/index.html#tela-56) | Planejada | 25 · revisão complementar | Proposta: /nucleos/[id]/manifesto/revisar | Modelo de versões e confirmação pendentes. |
| 57 | Manifesto e cuidado | [Compartilhar manifesto](atlas/index.html#tela-57) | Planejada | 25 · compartilhar | Proposta: manifesto · confirmação de exportação | Exportação, permissão coletiva e revogação pendentes. |
| 58 | Criar e entrar no Núcleo | [Convidar para o Núcleo](atlas/index.html#tela-58) | Recorte existente | 14, 32 | /comecar/convite-inicial/[id] | Geração existente; QR, revogação por interface e lista de pendentes são futuras. |
| 59 | Criar e entrar no Núcleo | [Gerenciar convites](atlas/index.html#tela-59) | Planejada | 14 · gestão complementar | Proposta: /nucleos/[id]/convites | Gestão de convites pela interface pendente. |
| 60 | Manifesto e cuidado | [Notificações](atlas/index.html#tela-60) | Planejada | 15 | Proposta: /notificacoes | Eventos, fila, preferências e canais pendentes. |
| 61 | Manifesto e cuidado | [Conversa de cuidado](atlas/index.html#tela-61) | Planejada | 24 | Proposta: /nucleos/[id]/cuidado/novo | Conversa guiada, privacidade e consentimento pendentes. |
| 62 | Manifesto e cuidado | [Ponte do Nós](atlas/index.html#tela-62) | Planejada | 37 | Proposta: /nucleos/[id]/cuidado/[id] | Sistema de preparação e eventual IA pendentes. |
| 63 | Manifesto e cuidado | [Cartão de Intenção](atlas/index.html#tela-63) | Planejada | 24, 37 · complemento v1.10 | Proposta: cuidado/[id]/intencao | Mensagem única e estados de resposta pendentes. |
| 64 | Manifesto e cuidado | [Marcar conversa ao vivo](atlas/index.html#tela-64) | Planejada | 24, 37 · complemento | Proposta: cuidado/[id]/encontro | Evento restrito e integração conversa/agenda pendentes. |
| 65 | Manifesto e cuidado | [Depois da conversa](atlas/index.html#tela-65) | Planejada | 37 · desfecho | Proposta: cuidado/[id]/desfecho | Estados de conclusão e arquivamento pendentes. |
| 66 | Preferências e segurança | [Configurações](atlas/index.html#tela-66) | Planejada | 26 | Proposta: /configuracoes | Preferências persistidas e módulos de segurança pendentes. |
| 67 | Preferências e segurança | [Privacidade e visibilidade](atlas/index.html#tela-67) | Planejada | 11, 26 · v2.5 | Proposta: /configuracoes/privacidade | Matriz documental existe; editor de visibilidade ainda não. |
| 68 | Preferências e segurança | [Preferências de notificações](atlas/index.html#tela-68) | Planejada | 26 · v2.7 | Proposta: /configuracoes/notificacoes | Notificações e canais pendentes. |
| 69 | Preferências e segurança | [Conta e segurança](atlas/index.html#tela-69) | Planejada | 26 · v2.8 | Proposta: /configuracoes/conta | Logout existente; administração de segurança e dados pendente. |
| 70 | Preferências e segurança | [Ajuda e suporte](atlas/index.html#tela-70) | Planejada | 26 · complemento | Proposta: /ajuda | Conteúdo de ajuda, canal e termos pendentes. |
| 71 | Preferências e segurança | [Sair de um Núcleo](atlas/index.html#tela-71) | Planejada | Complemento de privacidade | Proposta: /nucleos/[id]/sair | Saída, transferência de criador e retenção pendentes. |
| 72 | Conta e entrada | [Entrada afetiva · opcional](atlas/index.html#tela-72) | Recorte existente | 01 | /boas-vindas | Apresentação opcional implementada. Cadastro/login diretos, sem login social nem aceite jurídico fictício. |

## Mapeamento das interfaces de origem

| Interface do catálogo | Telas do novo atlas |
|---|---|
| 01 | 01 — Conta; 72 — Entrada afetiva · opcional |
| 02 | 13 — Início do Núcleo |
| 03 | 14 — Agenda do Núcleo; 15 — Detalhe do evento; 16 — Novo evento; 17 — Editar evento |
| 04 | 18 — Acordos; 36 — Nossa Essência |
| 05 | 24 — Detalhe do Hábito; 25 — Histórico do Hábito; 26 — Reflexões do Hábito |
| 06 | 24 — Detalhe do Hábito |
| 07 | 38 — Nossa Árvore; 39 — Marcos e celebrações |
| 08 | 19 — Novo acordo · necessidade |
| 09 | 39 — Marcos e celebrações; 40 — Memórias; 41 — Detalhe da memória; 42 — Galeria de fotos |
| 10 | 21 — Novo acordo · compreensão; 49 — Meu perfil; 63 — Cartão de Intenção |
| 11 | 28 — Confirmar após teste; 29 — Definir teste do legado; 50 — Perfil · maturidade e opções; 67 — Privacidade e visibilidade |
| 12 | 01 — Conta; 02 — Criar conta |
| 13 | 12 — Seus Núcleos |
| 14 | 58 — Convidar para o Núcleo; 59 — Gerenciar convites |
| 15 | 60 — Notificações |
| 16 | 27 — Registrar momento; 35 — Registrar experiência |
| 17 | 43 — Demonstrar gratidão |
| 18 | 10 — Inserir convite; 11 — Aceitar convite |
| 19 | 45 — Perfil de membro; 54 — Lista de desejos |
| 20 | 46 — Gostos do membro |
| 21 | 34 — Detalhe de experiência; 35 — Registrar experiência |
| 22 | 30 — Revisar Hábito; 31 — Propor ajuste; 32 — Propor encerramento; 33 — Acompanhar revisão |
| 23 | 37 — Promover para Essência |
| 24 | 61 — Conversa de cuidado; 63 — Cartão de Intenção; 64 — Marcar conversa ao vivo |
| 25 | 55 — Nosso manifesto; 56 — Revisar manifesto; 57 — Compartilhar manifesto |
| 26 | 66 — Configurações; 67 — Privacidade e visibilidade; 68 — Preferências de notificações; 69 — Conta e segurança; 70 — Ajuda e suporte |
| 27 | 51 — Sobre mim; 53 — Editar perfil afetivo; 54 — Lista de desejos |
| 28 | 52 — Gostos, cuidado e datas; 53 — Editar perfil afetivo |
| 29 | 06 — Escolher caminho |
| 30 | 07 — Tipo de Núcleo |
| 31 | 08 — Propósito do Núcleo |
| 32 | 09 — Convite inicial; 58 — Convidar para o Núcleo |
| 33 | 47 — Tipos de vínculo |
| 34 | 48 — Nossa jornada |
| 35 | 44 — Conexões |
| 36 | 23 — Aprovações |
| 37 | 62 — Ponte do Nós; 63 — Cartão de Intenção; 64 — Marcar conversa ao vivo; 65 — Depois da conversa |

## Fidelidade às fontes aprovadas

28 telas do documento importadas em 52 composições e variações; 41 pontos de acesso ao desenho histórico. As telas implementadas de entrada têm layout próprio. Paleta, textos e ícones das três rotas de onboarding comparados ao app com sessão validada; extensões e limites de web sinalizados. Consultar [origens e manutenção](FIDELIDADE.md).

## Verificação histórica do artefato — v0.12.0

Inventário sem IDs duplicados ou destinos ausentes; 37 origens cobertas; 72 prévias, 178 saídas do contrato e 360 estados visuais verificados com Playwright; 52 composições aprovadas também renderizadas. Busca, filtros, teclado, 13 percursos, modo web, impressão CSS e ausência de transbordamento horizontal a 375 px conferidos. Nenhum erro JavaScript detectado. A impressão foi verificada por CSS, sem exportação ou inspeção de PDF.

Esta validação comprova o funcionamento do atlas. Não valida novamente funcionalidades do aplicativo, integrações Supabase nem regras futuras ainda sem implementação.


## Navegação e sessão — v0.13.0

Conta → Seus Núcleos → Início escolhido. Sem associação, criar ou conferir convite; destino específico tem prioridade após login. Todo /comecar e /nucleos exige sessão validada antes de renderizar; token expirado com renovação válida mantém a sessão. Tela 12 tem listagem real protegida por RLS; nenhuma alteração em permissões do banco. Validação atual: 72 prévias, 180 saídas, 360 estados, 14 percursos e Visão global sincronizada; 132 testes do aplicativo, tipos/build e revisão independente aprovados. Métricas da seção histórica acima pertencem à entrega anterior.
