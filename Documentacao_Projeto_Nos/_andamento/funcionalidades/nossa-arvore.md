# Continuidade — Tela 07: Nossa Árvore

**Versão vigente:** 0.11.0. **Atualizado:** 2026-10-03. **Status:** próximo recorte a especificar; interface ainda não implementada.

## Objetivo e fontes

Apresentar evolução coletiva com dados reais, sem ranking individual nem números fictícios. Ler a [Tela 07 no catálogo v2.1](../../Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md#tela-07---nossa-árvore), o [impacto v1.4](../../Projeto_Nos_v1.4_Sistema_de_Impacto.md), os [marcos v1.6](../../Projeto_Nos_v1.6_Sistema_de_Marcos_de_Evolucao_e_Celebracoes_Saudaveis.md) e os estados/permissões v2.4/v2.5.

## Base disponível e decisões pendentes

Existem Núcleos, vínculos, propostas, respostas, estados de Hábito, momentos, ciclos e revisões. Hábitos ativos não provam frequência cumprida; momentos não equivalem automaticamente a prática bem-sucedida. Experiências continuam com contrato atual; Essência não tem fluxo de promoção implementado. Não existem cálculo persistido de experiência, níveis, estágio ou celebrações.

Antes de codificar, mapear quais eventos reais podem alimentar indicadores e quais exigem novo contrato. Definir recorte, permissões, origem das contagens e regras de evolução; não inferir pontuação a partir da quantidade de cliques ou inventar progresso. Os números da Tela 07 são exemplos visuais. Definir com o usuário as decisões de produto que alterem materialmente as regras. Não avançar automaticamente para a Tela 08.

## Primeiro passo executável e critérios de aceite

1. Confrontar fontes e esquema atual; registrar matriz curta de indicador, fonte real, regra e lacuna.
2. Fechar o recorte funcional e navegação entre Home, Acordos e Nossa Árvore, incluindo vazio, erro e carregamento.
3. Implementar apenas indicadores sustentados pelo contrato aprovado, com leitura isolada por Núcleo, responsividade e movimento reduzido.
4. Validar dados/isolamento e percurso autenticado, executar verificações pertinentes, revisar diff e registrar entrega antes de incrementar versão.

Aceite: nenhum dado de exemplo apresentado como real; nenhuma exposição de contribuição individual; contagens com significado explícito; evolução reproduzível e consistente com as regras aprovadas. Publicação pública e confirmação autenticada remota da interface de Hábito são pendências independentes; a v0.11.0 já tem migração remota conferida.
