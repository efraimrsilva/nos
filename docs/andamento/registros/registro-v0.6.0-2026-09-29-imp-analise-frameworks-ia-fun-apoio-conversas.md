# Registro — v0.6.0 — 2026-09-29 — Imp. de análise de frameworks de IA com Fun. de apoio a conversas

**Status:** análise concluída; nenhuma funcionalidade de IA implementada. **Versão do aplicativo:** 0.6.0, sem incremento por pesquisa documental.

## Objetivo e contexto

Comparar Google Genkit, Vercel AI SDK e Mastra para o Projeto Nós (Next.js 16, TypeScript, Supabase Auth/Postgres/RLS). A agenda está concluída; Acordos continua em desenvolvimento local, sem migração validada no `nos-dev`. A especificação de Conversas Guiadas prevê o Ponte do Nós como apoio privado, sem chat livre, diagnóstico, decisão por terceiros ou substituição de consentimento.

## Requisitos e decisões

- Preservar autenticação e autorização por Núcleo antes de qualquer consulta ao modelo; limitar a entrada ao conteúdo explicitamente escolhido pela pessoa e nunca usar chave administrativa para contornar RLS.
- Exibir sugestões como rascunhos privados e editáveis. Aceite, publicação e escrita em entidades de domínio continuam em operações determinísticas e autenticadas.
- Evitar registro de texto afetivo em traces, logs e memória de agente; definir retenção, exclusão e política do provedor antes de transmitir dados reais.
- **Recomendação para um primeiro experimento autorizado:** AI SDK Core em uma rota de servidor Next.js para uma sugestão pontual do Ponte do Nós, sem `useChat`, memória, RAG ou agente autônomo. Começar por alternativas determinísticas de microcopy, caso cubram a necessidade.
- **Genkit:** opção válida se surgirem vários fluxos de IA com avaliação e rastreamento local. Requer integração explícita com Supabase; seu monitoramento Firebase/Google Cloud adiciona configuração e custo operacional.
- **Mastra:** reavaliar apenas se houver fluxos de agentes duráveis, ferramentas e memória com necessidade demonstrada. Sua persistência e traces ampliam a superfície de dados sensíveis.

## Evidência e resultado

Foram consultados Context7 e documentação oficial: [Genkit flows](https://genkit.dev/docs/js/flows/), [Next.js](https://genkit.dev/docs/js/app-frameworks/nextjs/), [monitoramento](https://genkit.dev/docs/js/observability/getting-started/); [AI SDK geração](https://ai-sdk.dev/docs/ai-sdk-core/generating-text), [provedores](https://ai-sdk.dev/docs/getting-started/choosing-a-provider), [telemetria](https://ai-sdk.dev/docs/ai-sdk-core/telemetry); [Mastra integração Next.js](https://mastra.ai/blog/nextjs-integration-guide), [workflows](https://mastra.ai/en/reference/workflows/snapshots) e [compatibilidade AI SDK v7](https://mastra.ai/blog/ai-sdk-v7-support). A recomendação é análise de adequação ao produto, sem teste de integração ou medição de desempenho/custo. Nenhuma dependência foi instalada.

## Arquivos, integrações, validação e próximos passos

Arquivo alterado: este registro e os resumos de continuidade. Não houve integração técnica. Validação: conferência do estado do Git, stack e contratos do produto; revisão documental das fontes oficiais. Octocode MCP não estava exposto nesta sessão; a pesquisa de código local foi delimitada com `rg`.

Próximo passo, se a funcionalidade for solicitada: especificar consentimento para envio ao provedor, entrada e saída permitidas, orçamento, retenção, falha segura e exemplos de avaliação; comparar um protótipo determinístico com uma chamada isolada ao AI SDK antes de incorporar dependências ao aplicativo.

**Atualização posterior (2026-09-29):** Acordos foi concluído na v0.7.0 e validado no `nos-dev` depois desta análise. O contexto acima descreve a situação na data da pesquisa; a recomendação sobre IA continua apenas documental.
