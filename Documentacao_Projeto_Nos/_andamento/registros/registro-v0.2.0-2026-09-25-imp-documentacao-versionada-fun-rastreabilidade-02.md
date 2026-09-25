# Registro — v0.2.0 — 2026-09-25 — Imp. de documentação versionada com Fun. rastreabilidade

**Versão do projeto:** 0.2.0
**Status:** Concluído, revisado e validado.

## Objetivo, contexto e requisitos

Adequar a entrega concluída da tela Tipo de Núcleo às novas instruções do usuário e preparar commit e push autorizados. O registro anterior não tinha versão e ficava na raiz de `_andamento`. O aplicativo estava em 0.1.0. É necessário centralizar a versão, sincronizar manifestos, criar registros por mudança e preservar a documentação histórica.

## Decisões técnicas

- Versão final 0.2.0: MINOR pela nova tela e seleção de nove tipos, já concluídas, revisadas e validadas na entrega precedente. Esta adequação de documentação integra a mesma entrega e não gera incremento adicional.
- Novo diretório `_andamento/registros/`; registro da tela migrado, preservando conteúdo, e novo registro específico desta adequação. Sufixos `-01` e `-02` identificam registros da mesma versão/data.
- Registros históricos anteriores permanecem intactos. A numeração conceitual 1.x/2.x corresponde à edição dos documentos, não à versão do aplicativo.
- Orientações locais de `AGENTS.md` complementadas com as regras atualizadas, preservando as instruções geradas pelo Next.js.
- Sem dependências novas, alteração de stack, configuração de serviços ou deploy.

## Arquivos alterados e integrações

- `package.json`, `package-lock.json`: versão da aplicação e do pacote raiz, sem alterar versões de dependências.
- `AGENTS.md`: protocolo persistente de registros e versionamento.
- `README.md`, `_andamento/README.md`, `estado.md`, `historico.md`, `funcionalidades/escolher-caminho.md`, `tecnologias/frontend.md`, `brag/BRAG.md`: versão vigente, referências e continuidade.
- Registro da tela movido para `registros/registro-v0.2.0-2026-09-25-imp-tela-tipo-nucleo-fun-selecao-vinculo-01.md`.
- GitHub: destino autorizado `origin/main` em `github.com/efraimrsilva/nos`; base verificada `32f208c`. Nenhum PR ou deploy solicitado.

## Validações realizadas

- Inspeção de Git antes das mudanças confirmou que as alterações locais pertenciam à entrega anterior desta sessão; remoto `main` consultado e alinhado à base.
- Reexecutados `npm.cmd test` (16 aprovados), `npm.cmd run build` e `npm.cmd run typecheck` na versão 0.2.0: todos aprovados. Inspeção visual e revisão independente da tela foram realizadas na implementação precedente, sem mudanças posteriores no código da tela.
- Verificados 55 links locais nos documentos de acompanhamento/README/Brag, sem destino ausente; versões dos manifestos consistentes. Autorrevisão do diff completo e `git diff --check` aprovados.
- Commit criado e inspecionado: os 21 arquivos da entrega estão presentes. Pendência removida do estado somente após essa verificação; fechamento documental incorporado ao mesmo commit, antes do push autorizado.
- A primeira tentativa de commit falhou por ausência de identidade no Git. A identidade dos três commits anteriores foi reutilizada apenas nessa invocação, sem alteração global.

## Resultado e limitações

Documentação versionada e manifestos sincronizados, preservando registros históricos. A revisão nesta etapa cobre documentação, manifestos e o conjunto a publicar; não representa uma nova revisão independente da implementação. Propósito e Convite continuam preparatórios; autenticação, Supabase e persistência não estão implementados.

## Próximos passos

Entrega GitHub autorizada; o commit e as referências remotas são a evidência do envio. Na próxima entrega de produto, implementar Propósito e criar seu próprio registro versionado.
