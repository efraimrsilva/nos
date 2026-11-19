# Registro — v0.12.0 — 2026-10-07 — Imp. de publicação do atlas com Fun. de Visão global e procedimentos

**Versão:** 0.12.0. **Status:** conjunto commitado e inspecionado; push normal autorizado para main, com verificação remota no encerramento.

## Objetivo, requisitos e escopo

Publicar no GitHub, em main, um único commit com descrição abrangente da Visão global e de seu procedimento permanente. Preservar versão funcional, código do aplicativo, dependências e banco; incluir documentação e comparações que compõem a mesma entrega. Autorização explícita do usuário nesta interação.

## Conteúdo e decisões

Aba Visão global acima de Todas as áreas: 72 telas em oito áreas, Conta primeiro, 13 percursos condicionais e distinção entre saídas previstas e ligações de contexto. Reaproveitamento de telas/dados/contratos/ações e composições do atlas, inclusão de novas telas pela fonte compartilhada, navegação de inspeção/retorno, filtros consistentes, endereço direto, teclado, celular e impressão por CSS. Correção do P2 de filtros obsoletos já reproduzida e reconferida na entrega.

Galeria de seis capturas antes/depois web/celular, preservação de comparações anteriores e índice com evidência mínima obrigatória. Procedimento em GUIA, FIDELIDADE, COBERTURA, README, andamento/README e frontend: avaliar impacto em todas as telas, sincronizar produto/atlas/fichas/percursos/pendências e acrescentar comparações a cada criação ou alteração. Reuso sincroniza visões do atlas; conferir o aplicativo continua obrigatório.

Andamento, histórico, Brag, teste permanente e registros da entrega/publicação acompanham a mesma unidade. Permanecem 30 recortes existentes e 42 planejadas; mapa não promove integração futura. [Registro da entrega](registro-v0.12.0-2026-10-07-03-imp-visao-global-atlas-fun-sequencia-sincronizacao-comparacoes.md).

## Verificação, revisão e controle Git

Base 7a1fedc21c90e62b2e644bf80e85c7929fce42f5; fetch confirmou HEAD e origin/main iguais (0/0). Verificações repetidas nesta publicação: npm.cmd test -- --workers=1, 108/108 aprovados; verify-global-view.mjs, 72 composições compartilhadas e atualização dinâmica, filtros, teclado, celular, hash e impressão; verify-fidelity.mjs, 72 prévias/178 saídas/360 estados/41 referências/52 layouts; verify-account-fidelity.mjs, seis telas reais em duas larguras sem divergência nos campos/textos/cores/fontes ou transbordamento. Sem erros JavaScript/rede externa no atlas. Tipos/build não repetidos nesta publicação exclusiva de atlas/documentação. Autorrevisão do diff completo; revisão independente da entrega reconferiu o P2 sem achados materiais restantes. Nenhuma nova revisão independente alegada nesta publicação.

Objeto inicial inspecionado, com 24 arquivos da mesma unidade e árvore idêntica ao índice preparado (965eace6228b75ebaae0b3f321bb2541e5f55f1a). Pendência removida somente após essa comprovação; atualização do controle incorporada ao mesmo commit lógico. artifacts/, .env*, dependências, builds e resultados de teste excluídos. 781 alvos de links locais e diff aprovados. Depois do push normal, conferir main remoto igual a HEAD e reportar o hash na resposta. Sem force-push ou alteração de branch. Commit identificado por docs(atlas): adicionar visão global e padronizar sincronização e comparações; hash final recuperável por git log.

## Resultado, limitações e continuidade

Publicação Git não comprova deploy. Impressão conferida por CSS, sem PDF; testes do atlas não certificam todos os módulos protegidos futuros. Sem alteração funcional nova ou incremento de versão por esta publicação. Próxima implementação: Nossa Árvore com fontes e contrato de dados definidos antes dos indicadores; seguir obrigatoriamente Atlas vivo e padrão de comparações. Dependências operacionais de autenticação de lançamento permanecem documentadas.
