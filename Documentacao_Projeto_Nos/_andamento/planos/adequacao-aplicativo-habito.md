# Adequação funcional do modelo Hábito — v3.8.0 — concluído localmente

Data: 06/11/2026. Base: main/331d224; branch de trabalho feat/modelo-habito. DOCS_DIR: Documentacao_Projeto_Nos.

## Escopo aprovado

Consolidar Experiência em Hábito no aplicativo existente. Por orientação explícita do usuário, transições e Essência continuam apenas esboços, com o mesmo informe de Manifesto. Não inventar critérios de passagem, recorrência ou integração persistida com eventos.

## Estratégia e aceite

- Apresentar três colunas, manter Kanban/Painéis/lista móvel, busca e ações atuais.
- Interpretar registros técnicos antigos `experience` como Hábito, sem modificar seus IDs, termos, versões, respostas ou datas. Nenhum estágio individual será persistido. A categoria antiga permanece somente para compatibilidade de armazenamento.
- Reutilizar detalhe, histórico e registro do Hábito. A função do banco deve aceitar o legado sob as mesmas condições atuais de participação e versão.
- Normalizar o argumento antigo de criação para `habit` na função do banco, preservando assinaturas. Um cliente antigo sem prazo não fabrica um período de teste: duração histórica ausente continua nula. O formulário atual continua exigindo 7–30 dias.
- Usar FeatureSketchNotice, o mesmo componente de Manifesto, na prévia de Essência. Nenhuma ação de promoção real.
- Migração aditiva de funções, aplicada somente localmente; sem alteração em massa dos dados. Recuperação consiste em restaurar as duas funções anteriores, preservando registros já criados. Publicação remota exige etapa própria.

## Execução e validação

- [x] Registrar regressões de agrupamento, entrada, compatibilidade SQL e percurso autenticado.
- [x] Confirmar falhas esperadas antes das alterações funcionais.
- [x] Adequar apresentação, leitura, função de criação e registro de momentos.
- [x] Conferir aplicativo e Atlas em computador/celular e guardar comparação anterior/posterior.
- [x] Executar tipos, build, testes pertinentes e verificadores das três visões do Atlas.
- [x] Revisar diff, atualizar contratos, roteiro manual, versão, registro, Brag e continuidade.

## Evidências iniciais

Git limpo; nenhum dado de Acordos no banco local antes de criar fixtures. Docker inicialmente parado, aberto para validação local. Supabase CLI 2.118.0 disponível. Context7 consultado na versão exata para migrações locais sem reset. Octocode 19.1.0 já configurado, sem ferramenta exposta; buscas precisas locais utilizadas, sem pesquisa avançada de dependências. Atlas18 inspecionado visualmente antes da edição; captura em artifacts/modelo-habito-atlas-antes.png. Nenhuma consulta ou migração remota.
