<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Documentação atualizada — orientação do usuário

- Sempre consultar Context7 para documentação de bibliotecas, frameworks, APIs e configuração técnica usada neste projeto, antes de implementar ou recomendar uso dessas tecnologias.
- Resolver a biblioteca com `resolve-library-id` e consultar `query-docs`; verificar compatibilidade com a versão instalada. Complementar com documentação oficial quando necessário.
- Não enviar segredos, dados pessoais, conteúdo afetivo nem código privado nas consultas.
- Se Context7 estiver indisponível, informar a limitação; não alegar consulta ou atualização que não ocorreu.
- Manter `Documentacao_Projeto_Nos/_andamento` atualizado e aguardar autorização do usuário antes de iniciar uma nova etapa após pedidos explícitos de pausa.

## Registros e versionamento — orientação atualizada em 2026-09-25

- `DOCS_DIR` é `Documentacao_Projeto_Nos`. A versão central do projeto fica em `_andamento/estado.md`, sincronizada com `package.json` e `package-lock.json`.
- Cada tela, implementação, funcionalidade ou mudança deve ter um novo registro em `DOCS_DIR/_andamento/registros/`, preservando o histórico. Registros legados permanecem identificados como históricos; não reatribuir versões de produto sem evidência.
- Título: `Registro — v<versão> — AAAA-MM-DD — Imp. de <implementação> com Fun. <funcionalidade>`.
- Arquivo: `registro-v<versao>-AAAA-MM-DD-imp-<implementacao>-fun-<funcionalidade>.md`. Para vários registros da mesma versão e data, acrescentar `-01`, `-02`, etc.
- Incluir versão, status, objetivo, contexto, requisitos, decisões técnicas, arquivos alterados, integrações, validações realizadas, resultado, limitações e próximos passos. Indexar cada registro em `estado.md`.
- Durante desenvolvimento, usar a versão vigente e status `Em andamento`. Somente após conclusão, revisão e validação, atualizar a versão e renomear arquivo/título: PATCH para correções e ajustes pequenos, MINOR para novas telas/funcionalidades compatíveis, MAJOR para mudanças estruturais/incompatíveis ou marco estável. MINOR e MAJOR zeram os números seguintes. Usar o maior impacto da entrega; documentação isolada ou trabalho incompleto não provoca incremento.
- Documentos novos ou atualizados devem identificar a versão vigente. As versões 1.x/2.x dos documentos conceituais são edições documentais, não versões do aplicativo.
- Manter contador de interações, auditoria a cada 100 interações, histórico, Brag document e pendência única de commit conforme as instruções globais do usuário. A pendência só é removida após verificar que o commit contém a entrega.
- Usar skills Superpowers aplicáveis; Context7 para documentação técnica e Octocode para pesquisa avançada de código/pacotes, verificando disponibilidade e compatibilidade. Não inventar consultas, medições ou resultados.
- Revisar o diff e executar as verificações pertinentes antes da entrega. Não fazer commit, push, merge ou deploy sem autorização; autorizações explícitas da sessão continuam válidas.
