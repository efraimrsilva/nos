# Registro — v0.3.0 — 2026-09-27 — Imp. de tela Propósito do Núcleo com Fun. rascunho local

**Versão do projeto:** 0.3.0
**Status:** concluído, revisado e validado.
**Impacto:** MINOR, nova tela funcional compatível com o onboarding existente (0.2.0 → 0.3.0).

## Objetivo e contexto

Substituir o espaço reservado em `/comecar/proposito` pela próxima tela prevista após Tipo de Núcleo. O protótipo (`Telas/Nós App.dc.html`, etapa `obProposito`) e o catálogo de interfaces v2.1 pedem nome, propósito editável, sugestão conforme tipo e ação Continuar. A autenticação e a persistência seguem pendentes; a interface não pode sugerir que um Núcleo foi criado.

## Requisitos e decisões técnicas

- O tipo continua sendo validado no servidor e é o único valor transportado na URL. Tipo ausente, desconhecido ou repetido volta à seleção vazia.
- Nome e propósito são campos locais do componente cliente, com limites de 80 e 500 caracteres e validação de conteúdo após `trim`. O texto não é enviado, salvo em armazenamento do navegador ou exposto na URL.
- A descrição já existente no catálogo dos nove tipos fornece uma sugestão contextual. A ação **Usar sugestão** preenche o campo, que permanece editável.
- **Continuar** apresenta uma conferência local do rascunho e informa claramente que nada foi criado ou salvo. **Editar** devolve os valores aos campos. Recarregar descarta o rascunho; a navegação não oferece contrato de preservação.
- O retorno leva a `/comecar/tipo?tipo=<id>` e preserva a escolha. A página de convite existente é do fluxo de entrada, não foi reutilizada como convite inicial de criação.
- Layout, fontes, foco e redução de movimento reutilizam a base do onboarding. Não foram adicionadas dependências.

## Arquivos alterados e integrações

- `src/app/comecar/proposito/page.tsx`: valida o tipo e apresenta a etapa.
- `src/features/onboarding/components/nucleus-purpose-form.tsx`: campos, sugestão, validação e conferência em memória.
- `src/features/onboarding/components/nucleus-type-form.tsx`: comentário do contrato de navegação atualizado.
- `tests/nucleus-purpose.spec.ts` e `tests/nucleus-type.spec.ts`: comportamento novo e regressão da etapa anterior.
- `package.json`, `package-lock.json`, `README.md` e documentos de acompanhamento: versão e continuidade. O README também foi corrigido para iniciar em `nos`, pois o lançador histórico na pasta pai não está mais presente.

## Validações realizadas e resultado

- TDD: os testes novos falharam pela ausência dos campos e do título antes da implementação; depois, `npm.cmd test` aprovou **22 testes** em desktop e mobile.
- `npm.cmd run typecheck`, `npm.cmd run build` e `git diff --check` aprovados. Build reconheceu `/comecar/proposito` como rota dinâmica.
- Inspeção visual em 390px e teste automatizado em 320px: formulário e conferência sem rolagem horizontal. Treze documentos de acompanhamento/README verificados sem links locais ausentes. Revisão própria do código e diff sem achados bloqueantes; não houve revisão independente.
- Octocode CLI 19.1.0 validado com busca local; MCP global configurado, ainda não carregado nas ferramentas desta sessão. Context7 consultado para Next.js; guias locais da versão 16.3.6 confirmaram o contrato de `searchParams` e formulário.

## Limitações e próximos passos

O rascunho não sobrevive ao recarregamento, não cria Núcleo e não gera convite. Antes de permitir criação real ou envio de conteúdo afetivo, implementar autenticação, autorização, contrato de servidor e proteção de dados. A próxima tela do fluxo de criação é Convite Inicial; sua integração deve consumir um Núcleo efetivamente criado, sem código fictício. Commit atômico e push para `origin/main` foram autorizados; Git fornece a evidência final da publicação.
