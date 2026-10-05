# Registro — v0.11.0 — 2026-10-04 — Imp. de fidelidade visual do atlas com Fun. de referência UX aprovada

Status: Concluído e validado localmente. Correção do material de planejamento, sem incremento de versão funcional.

## Objetivo e critérios

Corrigir a simplificação excessiva do atlas a partir das telas implementadas e de `Telas/Nos_App.dc.html`, nome renomeado pelo usuário. Conta permanece a primeira tela. Preservar a identidade aprovada: canvas #F6F3EB, floresta #2E4A20, folha #4F7E2C, lilás #6A3FD1, Fredoka e Plus Jakarta Sans; conservar também as cores contextuais do documento.

As rotas /comecar, /comecar/tipo e /comecar/convite devem refletir textos, disposição, árvore, ícones e interações reais. O documento aprovado deve estar acessível no atlas, com suas abas, ilustrações, hierarquia e estados. As 72 fichas continuam distinguindo recortes existentes e dependências futuras. Exemplos visuais não comprovam integrações, métricas ou consentimento.

## Plano proporcional

- [x] Comparar o código e capturas atuais; demonstrar a divergência com uma verificação de regressão.
- [x] Importar os layouts do documento em HTML estático local, com geração reproduzível, sem depender do support.js ausente ou de serviços externos.
- [x] Reproduzir as telas de entrada implementadas, usando ícones Lucide da versão instalada e a paleta do app; manter o comportamento local de rascunho e conferência de convite.
- [x] Integrar layouts aprovados e extensões coerentes às 72 telas, incluindo navegação contextual, abas operantes e acesso à referência visual histórica quando o contrato atual divergir.
- [x] Verificar conteúdo, fontes, imagens, destinos, teclado, estados, responsividade e ausência de chamadas a serviços; executar revisão independente e corrigir achados.
- [x] Atualizar guia, cobertura, andamento, referências ao novo nome e Brag, sem alterar manifestos ou publicar automaticamente.

## Arquivos e arquitetura

`wireframes/atlas/atlas.js` coordena navegação e fichas; `atlas.css` mantém a moldura editorial; módulos locais de layouts e estilos representam o produto. `wireframes/tools/` contém importador e verificação. O importador lê o HTML aprovado e produz marcação estática, sem executar um interpretador de templates no navegador do usuário. O código do aplicativo e o documento aprovado permanecem preservados.

## Contexto e limites

HEAD inicial b853bbaafc2b87aeca7324246f96ce391de55b24, main. Alteração preexistente: renomeação de Nós App.dc.html para Nos_App.dc.html. A versão continua 0.11.0 conforme instrução expressa do usuário. Esta solicitação autoriza corrigir o atlas; não autoriza nova publicação Git. Context7 consultado para SVG Lucide; nenhum pacote novo necessário. Superpowers de entendimento, depuração, planejamento, revisão e verificação aplicados proporcionalmente.

## Alterações e integrações

Importados 52 layouts estáticos que cobrem as 28 telas do HTML aprovado, incluindo abas e nove tipos de vínculo. O documento original permanece preservado, com sua renomeação feita pelo usuário. O atlas tem 8 composições de entrada baseadas no código, 33 composições com base visual no documento e 31 extensões com identidade consistente; todos os 72 IDs permanecem. Conta continua primeira. Campos locais, rádio nativo, conferência de rascunho, prévia de convite associada ao código, foco lilás e movimento reduzido preservados.

`approved-layouts.js` é gerado e rastreável pelo SHA-256 da fonte. A ferramenta usa o Playwright já instalado para transformar a marcação sc-if/sc-for em HTML estático; não inclui o support.js ausente, interpretador de templates ou framework no navegador. SVG Lucide 1.48.0, fontes em pesos 400–800 e licenças locais; nenhuma dependência nova.

Arquivos principais: atlas/index.html, atlas.js, screens.js, product-ui.js, product.css, approved-layouts.js, icons.js, recursos locais; tools/import-approved.mjs e verify-fidelity.mjs; GUIA.md, FIDELIDADE.md, COBERTURA.md, README, andamento e Brag. Links ao antigo nome corrigidos somente nos documentos afetados.

## Decisões de UX e contratos

A aplicação é a referência das rotas implementadas de entrada. A composição aprovada é a base visual dos módulos restantes; decisões e contratos atuais prevalecem sobre exemplos históricos. O modo vivo não exibe métricas de força, níveis, contadores da árvore ou promoção automática. Revisão de Hábito mantém unanimidade, sete dias e aplicação explícita; Ponte é preparação privada e cartão único, sem chat. Perfil alheio permanece consulta. O modo histórico preserva os exemplos originais com aviso visível. Destinos atuais aparecem também fora da tela como ferramentas de revisão, sem acrescentar botões fictícios à composição do aplicativo.

## Validação e revisão

Regressão demonstrada antes da correção: canvas #FFFEFA do atlas divergia de #F6F3EB do aplicativo. Após a correção, verify-fidelity.mjs aprovou 72 prévias, 173 saídas, 360 estados, 41 referências, 52 layouts de 28 telas; comparação das três rotas reais e SVG/textos dos nove tipos. Conferidas seleção preservada, rascunho antes da criação, edição que remove prévia de convite, abas nos modos vivo/histórico, vínculos, privacidade, revisão, ausência de chat, teclado, filtros, 12 percursos, web, 375px, movimento reduzido e impressão por CSS. Zero pageerror e zero chamadas HTTP externas no atlas. Capturas inspecionadas.

Revisão independente detectou chat histórico, regras sem contrato, destinos incorretos e DIVs com aparência de ação. Todos corrigidos e reconferidos. Três ajustes finais (legenda de força, retorno de registro e título propositivo de Essência) também corrigidos e reconferidos pelo revisor, sem achados materiais remanescentes. Autorrevisão e conferência de links/diff completam a entrega. Não foi repetida a suíte funcional de 84 testes, tipos ou build do aplicativo: não houve alteração em código do produto, dependências, banco ou manifestos. A comparação visual não executou operações Supabase.

A inspeção final identificou uma imagem interna de SVG com o nome antigo tree-new.png na Tela 44. A verificação ampliada primeiro reproduziu a falha; o importador foi corrigido para tree.png, os layouts foram regenerados e toda a verificação passou novamente. A revisão independente confirmou o carregamento da imagem. Conferidos 699 links locais e git diff --check, sem erro. O conteúdo de Nos_App.dc.html tem o mesmo objeto Git da fonte anterior: 3000133ccf5ffc4bb8ce54d4c0c013564f0ae66b; sua renomeação não altera o documento aprovado.

## Resultado, limitações e retomada

O atlas agora contém as composições aprovadas e a entrada implementada, sem a redução anterior a um cartão genérico. Mantém 45 telas planejadas e 27 recortes existentes, com ampliações pendentes. O documento aprova composições móveis; layouts web dos demais módulos ainda precisam de definição. Estados genéricos são padrões de revisão, não mensagens funcionais finalizadas para toda operação. A impressão foi conferida por CSS; não houve exportação ou inspeção de PDF. Redução de retrabalho é benefício esperado, não resultado medido.

Versão 0.11.0 preservada por instrução expressa. Nenhum commit, push, deploy, envio, cadastro ou migração nesta entrega. Unidade lógica pronta para commit: fidelidade visual do atlas, ativos, importação, verificação, documentação e referências do HTML renomeado. Próximo passo: usar o atlas corrigido em todas as entregas e fechar o contrato de Nossa Árvore antes da implementação.
