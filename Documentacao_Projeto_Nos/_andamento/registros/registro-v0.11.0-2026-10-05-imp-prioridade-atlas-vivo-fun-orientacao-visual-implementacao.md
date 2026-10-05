# Registro — v0.11.0 — 2026-10-05 — Imp. de prioridade do atlas vivo com Fun. de orientação visual da implementação

**Status:** concluído e validado. Alteração documental; versão funcional 0.11.0 preservada.

## Objetivo, contexto e requisitos

Após aprovar a correção visual, o usuário solicitou conferir a sinalização de todas as telas e explicitar a prioridade alta do atlas vivo para guiar sua criação e implementação. Preservar comparação histórica, sinais de pendência, trabalho anterior ainda não commitado e regras do produto. HEAD b853bbaafc2b87aeca7324246f96ce391de55b24, main.

## Decisões e procedimento

O guia do atlas é a fonte do procedimento obrigatório. Consultar o aspecto no modo Atlas vivo antes de criar, implementar, alterar ou revisar uma tela; conferir ID/percurso, hierarquia, paleta, fontes, ícones, abas, navegação e estados, além da ficha. Registrar referência e decisões abertas, seguir o desenho com prioridade alta, comparar a interface real antes de concluir e sincronizar atlas/ficha/cobertura/registro na mesma entrega. Mudança necessária exige motivo registrado e atualização conjunta; o modo histórico é comparação. A prioridade visual não altera contratos de dados, segurança ou consentimento.

Planejada indica implementação/contrato pendentes; Recorte existente confirma uma base funcional com limites. Aprovação da composição não significa que todos os elementos estejam implementados. Composição web ausente precisa ser definida no recorte correspondente.

## Arquivos e integrações

- README.md: orientação na entrada do repositório.
- wireframes/GUIA.md: procedimento central de prioridade alta.
- wireframes/FIDELIDADE.md e COBERTURA.md: precedência visual e resultado da conferência de sinais.
- _andamento/README.md, estado.md e tecnologias/frontend.md: orientação para retomada e execução das interfaces.
- _andamento/historico.md e brag/BRAG.md: evento e contribuição documentais.
- Este registro: requisitos, decisão, evidência e retomada.

Nenhuma alteração de código do app, renderizador do atlas, dependências, banco, manifestos ou telas aprovadas. Documentos auxiliares apontam para o procedimento central, evitando versões concorrentes da regra.

## Validações

Cruzamento das 72 fichas com COBERTURA.md e sinais reais no navegador: situação e dependências coincidentes, rota/regra/permissão/origem preenchidas; 45 Planejadas e 27 Recortes existentes. Rotas dos 27 recortes encontradas em src/app, incluindo retorno de autenticação e estados/abas que compartilham rota. Isso não revalida integrações ou ampliações ilustradas.

Executado novamente tools/verify-fidelity.mjs: 72 prévias, 173 saídas, 360 estados, 41 referências, 52 layouts de 28 telas; três rotas de entrada e nove tipos comparados, sem erros JavaScript ou chamadas externas. A auditoria pontual está em artifacts/audit-atlas-signals.mjs, recurso temporário ignorado pelo Git; não introduz infraestrutura de testes. Links, âncoras e diff documental conferidos antes da conclusão. A suíte funcional do produto não foi repetida porque esta entrega altera somente orientação documental.

Conferência final: 709 links locais sem alvo ausente e git diff --check aprovado. Autorrevisão documental e revisão independente de precedência, sinalização e limites sem achados materiais. A revisão independente foi de leitura; as auditorias foram executadas pelo agente principal.

## Resultado, limitações e próximo passo

Sinalização coerente; prioridade alta explícita nos pontos de entrada, continuidade e frontend. Nenhuma tela foi promovida a concluída sem implementação; nenhuma mudança de versão funcional, commit, push ou deploy. Usar Tela 38 no Atlas vivo e fechar seu contrato antes da próxima implementação. A presente orientação complementa a correção de fidelidade anterior e pertence ao mesmo conjunto lógico pendente de commit.
