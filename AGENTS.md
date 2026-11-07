# Diretrizes permanentes do projeto Nós

## Antes de iniciar qualquer entrega

- Ler este arquivo, conferir `git status` e identificar alterações locais existentes. Preservar o trabalho em andamento; não descartar, sobrescrever ou incluir mudanças alheias em uma publicação sem conferir seu escopo.
- Consultar `README.md`, `Documentacao_Projeto_Nos/_andamento/estado.md`, o plano em `Documentacao_Projeto_Nos/_andamento/planos/mvp.md` e os contratos da funcionalidade afetada. Ler os registros recentes relacionados antes de retomar uma tarefa.
- Na primeira leitura ou revisão das diretrizes gerais, percorrer toda a documentação do projeto: documentos conceituais 1.x/2.x, andamento, contratos, planos, registros, testes de caixa preta, guias do Atlas e documentação operacional. Nas retomadas, reler o estado e os documentos afetados; não tratar uma busca por palavras-chave como leitura integral. O arquivo `estado-atual.md` é histórico; a retomada canônica está em `estado.md`.
- Conferir informações documentadas com o código e as evidências disponíveis. Datas, versões e declarações antigas de situação não comprovam o estado atual. Registrar divergências e corrigir as indicações vigentes no escopo da entrega, preservando o histórico.
- Não presumir que o desenho aprovado já esteja implementado.
- Definir o resultado esperado, o recorte da mudança, as telas/rotas e regras afetadas e como validar o comportamento. Respeitar decisões explícitas do usuário; esclarecer apenas dúvidas que impeçam uma execução correta.

## Implementação e integridade do produto

- Antes de cada nova funcionalidade ou evolução de funcionalidade de impacto médio ou grande, fazer uma verificação bem rápida e criteriosa de frameworks que possam facilitar o desenvolvimento e agregar valor concreto ao projeto. Comparar com a stack e as soluções existentes, considerando compatibilidade, manutenção, maturidade, segurança, desempenho, custo e complexidade adicionada. Consultar Context7 e fontes oficiais quando a avaliação depender de documentação técnica; usar Octocode nas pesquisas avançadas de código ou dependências. Registrar brevemente no plano ou registro da entrega as opções pertinentes, o benefício esperado e a decisão justificada de adotar ou não. A avaliação é obrigatória; a adoção não: preservar KISS (manter a solução simples) e YAGNI (não implementar o que ainda não é necessário), sem pesquisa extensa ou dependências sem benefício demonstrável.
- Antes de criar ou alterar uma interface, inspecionar seu desenho no modo Atlas vivo e ler a ficha, o percurso, as permissões e as pendências. Seguir `Documentacao_Projeto_Nos/wireframes/GUIA.md`; consultar somente o texto da ficha não substitui a revisão visual.
- Reutilizar componentes, estilos e regras existentes. Preservar a identidade visual, a linguagem de cuidado, a navegação desktop/mobile e a acessibilidade, incluindo teclado, foco, rótulos e estados de interação.
- Cobrir os estados aplicáveis: carregamento, vazio, sucesso, erro, falta de permissão e sessão expirada. Confirmar destinos, retorno, cancelamento e feedback das ações; evitar gravações duplicadas e mensagens de sucesso antes da confirmação da operação.
- Preservar privacidade, consentimento e isolamento entre contas e Núcleos. Validar autorização no servidor e no banco quando aplicável; ocultar um controle na interface não constitui proteção de acesso.
- Preservar os princípios do Nós: participação voluntária, possibilidade de recusar/adiar, ausência de ranking afetivo, punições por continuidade ou chat livre. IA e sugestões não substituem consentimento. Não inventar métricas de evolução, diagnósticos, prazos de retenção ou garantias operacionais.
- Consultar a documentação compatível com as versões instaladas antes de depender de APIs de bibliotecas. Usar Context7 quando disponível; complementar com documentação oficial, tipos e fontes locais quando a versão exata não estiver indexada. Para Next.js, conferir os guias instalados em `node_modules/next/dist/docs/`. Não afirmar uso de ferramentas indisponíveis nem instalar dependências apenas porque foram citadas em registros antigos.
- Não transformar exemplos, esboços ou etapas planejadas em funcionalidades anunciadas como prontas. Mudanças nas regras de domínio devem atualizar o contrato correspondente.

## Validação proporcional à mudança

- **Ajustes pontuais de baixo risco:** para correção de texto, rótulo, cor, espaçamento ou alinhamento sem mudança de comportamento, basta conferir diretamente o trecho alterado no aplicativo e atualizar e conferir sua representação no Atlas vivo. Use uma largura representativa e confira outra apenas se o ajuste afetar a adaptação da tela. Registre a conferência em uma linha. Esses ajustes dispensam novos testes, suítes automatizadas, build e galeria de antes/depois por padrão. Se o ajuste atingir um estilo compartilhado, confira as áreas diretamente afetadas.
- **Mudanças funcionais ou com risco de regressão relevante:** seguir as verificações abaixo para o recorte afetado. Mudanças em interação, navegação, acessibilidade, regras, dados ou permissões recebem a validação proporcional ao risco.
- Para alterações de código do aplicativo nesse segundo grupo, executar `npm run typecheck` e `npm run build`, além dos testes pertinentes ao comportamento alterado. Consultar os scripts de `package.json` e os verificadores existentes em `scripts/` antes de criar novos comandos.
- Executar os testes Playwright afetados; para mudanças de acesso, persistência ou permissões, conferir também os fluxos autenticados e os testes de banco aplicáveis. Usar `npm run test:authenticated`, `npm run test:db` e `npm run test:calendar-locks` conforme o recorte e os pré-requisitos locais documentados.
- Para mudanças visuais ou de interação, verificar aplicativo e Atlas em desktop e celular, incluindo os estados e modais afetados. Guardar evidências em `Documentacao_Projeto_Nos/wireframes/comparacoes/` e vinculá-las ao registro da entrega.
- Capturar o antes antes de alterar a tela; apresentar depois, Atlas e aplicativo real quando existente. Se não houver composição anterior, declarar isso. Seguir `wireframes/comparacoes/README.md`: pastas `v<versão>-AAAA-MM-DD-assunto-tela_<ID>`, IDs reais com pelo menos dois dígitos, `index.html`, imagens locais, ambiente, larguras, diferenças e limites. Não fabricar capturas anteriores nem substituir galerias históricas.
- Executar os verificadores pertinentes em `Documentacao_Projeto_Nos/wireframes/tools/` e `scripts/` quando o Atlas mudar; conferir renderização compartilhada, navegação, estados e ausência de erros. Uma alteração interativa no Atlas exige validação própria, mesmo sem mudança no aplicativo.
- Criar ou ajustar testes quando forem necessários para demonstrar a correção e proteger comportamentos relevantes. Não ampliar a suíte apenas para reproduzir detalhes internos da implementação.
- Registrar comandos, resultados, ambiente e limites da verificação. Teste não executado permanece como não executado; explicar impedimentos e pendências. Não declarar a entrega integralmente validada quando houver verificações necessárias pendentes.
- Fazer autorrevisão do conjunto final e corrigir os achados relevantes antes de concluir. Quando houver revisão independente, registrar seu escopo e resultado reais; não apresentá-la como realizada apenas porque constava de um plano anterior.
- Em mudanças exclusivamente documentais, conferir coerência, caminhos, links locais e o diff; não executar build ou testes do aplicativo sem necessidade.

## Documentação e continuidade

- Toda entrega deve deixar rastreável o que mudou, por quê, o que foi verificado e o que falta. Criar um registro em `Documentacao_Projeto_Nos/_andamento/registros/` para cada mudança relevante, inclusive diretrizes documentais, seguindo o protocolo de `_andamento/README.md`: `registro-v<versão>-AAAA-MM-DD-imp-<implementação>-fun-<funcionalidade>.md`; quando necessário, inserir `-01`, `-02` etc. imediatamente após a data. Incluir título, versão, status, objetivo/contexto, requisitos, decisões, arquivos, integrações, validações, resultado, limites e próximo passo.
- Atualizar o resumo canônico de retomada em `Documentacao_Projeto_Nos/_andamento/estado.md` e as indicações vigentes do `README.md` quando afetados. Apontar o registro da entrega e o próximo passo concreto, sem duplicar históricos completos em vários arquivos.
- Acrescentar os eventos relevantes em `_andamento/historico.md`. Atualizar `brag/BRAG.md` quando houver contribuição ou resultado que justifique o registro, separando problema, contribuição, resultado verificado e benefício esperado; não inventar impacto medido. Manter as pendências de commit no estado e removê-las somente após comprovar a inclusão no objeto Git.
- Preservar o controle de interações e marcos de revisão já mantido em `estado.md`, contando conclusões conforme o critério registrado, sem contar cada mensagem de direcionamento como nova entrega nem inventar números quando houver lacunas. Não exibir indicadores de contexto dispensados pelo usuário.
- Sincronizar os contratos em `_andamento/funcionalidades/` e o plano MVP quando a mudança atingir regras, critérios, prioridades ou cobertura. Preservar os roteiros e resultados existentes em `_andamento/testes-caixa-preta/`; a criação ou ampliação de casos depende da decisão do usuário conforme a regra abaixo. Casos autorizados começam como Não executados até haver evidência.
- Não gerar, detalhar ou acrescentar testes de caixa preta automaticamente ao criar ou alterar uma funcionalidade. Após concluir a entrega, apresentar na resposta final apenas sugestões pertinentes, com descrição breve e objetiva, semelhante à descrição de commit/push do Git: `Sugestão de testes de caixa preta: <fluxos e comportamentos a conferir>.` O usuário decide se os testes serão preparados e realizados; criar ou ampliar roteiros somente após sua autorização, respeitando autorizações explícitas já dadas para o escopo. Se não houver teste pertinente, não inventar sugestões. Quando autorizados, seguir `_andamento/testes-caixa-preta/README.md`, mantendo rastreabilidade ao MVP/Expansão, ID estável, caminho, pré-condição, ação e resultado esperado. Registrar execuções/retestes relatados em `resultados.md`, preservando falhas e ambientes; não inferir aprovação. Esta decisão sobre roteiros de caixa preta não dispensa as verificações técnicas aplicáveis à entrega.
- Atualizar as partes afetadas do Atlas: desenho, ficha, percursos, MVP, Visão global, cobertura e pendências. Preservar IDs estáveis e a reutilização das representações; conferir links e evitar cópias visuais divergentes.
- Todo modal afetado deve constar no Atlas, na ficha da tela e no registro. Inclua-o na galeria quando ela for exigida, com nome, gatilho, finalidade, permissão, resultado e situação real/esboço. Seguir `Documentacao_Projeto_Nos/_andamento/funcionalidades/modais-interface.md`; links entre rotas continuam classificados como navegação.
- Preservar registros e galerias históricos. Documentar correções de entendimento em uma atualização identificada, sem apagar a evidência do que foi registrado anteriormente.
- Edições `Projeto_Nos_v1.x` e `Projeto_Nos_v2.x` identificam documentos conceituais, não versões do aplicativo. Não renomeá-las a cada entrega nem alterar arquivos apenas para renovar datas. Manter uma fonte responsável por tema e apontar para ela nos resumos.

## Dados, ambiente e publicação

- Nunca registrar segredos, tokens, senhas ou dados pessoais em código, commits, logs, capturas ou documentação. Usar configuração de ambiente e exemplos sem credenciais; preservar a validação TLS.
- Conferir explicitamente o ambiente de destino antes de executar comandos de banco, autenticação ou infraestrutura. Priorizar o ambiente local documentado para testes e usar contas/dados descartáveis, removendo apenas os recursos criados pela própria validação.
- Seguir os comandos e pré-requisitos do `README.md`; usar Node compatível e instalação reproduzível pelo lockfile. Reutilizar o servidor do usuário e isolar builds/portas de testes quando necessário. `npm run dev` acompanha fontes; `npm start` serve o último build. Encerrar apenas processos iniciados pela tarefa, preservando o ambiente de trabalho.
- Versionar mudanças de esquema e permissões em migrações em `supabase/migrations/`. Não reescrever migrações já aplicadas; validar a mudança e considerar compatibilidade, preservação dos dados e recuperação antes de aplicá-la remotamente.
- Não resetar bancos, apagar volumes ou dados existentes, nem executar operações destrutivas fora do escopo autorizado. Registrar riscos e obter autorização quando necessária; preservar meios de recuperação antes de operações com risco de perda de dados.
- Commit, push, migração remota e deploy devem respeitar a autorização e o escopo da sessão. Antes de publicar, revisar o diff e os arquivos incluídos, conferir versão/documentação/Atlas e concluir as verificações aplicáveis.
- Distinguir código local, commit criado, push confirmado, migração aplicada, deploy concluído e fluxo verificado online. Registrar identificadores e evidências disponíveis; a confirmação de uma etapa não comprova as demais.
- Configurações locais não atualizam automaticamente serviços hospedados. Não aplicar a configuração completa do Supabase local no remoto; para e-mails, seguir `supabase/templates/README.md`. Modelo preparado, aviso ativado, pedido aceito, recebimento externo e troca efetiva de senha são evidências distintas.

## Versionamento do sistema e Atlas vivo

- Usar versionamento semântico: PATCH para correções e ajustes compatíveis; MINOR para novas funcionalidades compatíveis; MAJOR para mudanças incompatíveis.
- Manter a mesma versão em `package.json`, na raiz e no pacote principal de `package-lock.json`, em `Documentacao_Projeto_Nos/_andamento/estado.md` e na identificação visível do Atlas vivo em `Documentacao_Projeto_Nos/wireframes/atlas/index.html`.
- Por decisão explícita do usuário em 07/11/2026, não registrar versões do aplicativo no `README.md` da raiz: não acrescentar versão atual, informes de release, histórico de versões ou avisos versionados de publicação. O README apresenta o produto, a stack, instruções de execução e links para a documentação responsável. Versionamento, entregas e situação de publicação ficam nos manifestos, no Atlas e em `Documentacao_Projeto_Nos/_andamento/`. Versões técnicas das dependências e caminhos de evidências históricas podem permanecer quando necessários para compreender ou executar o projeto; não constituem um registro de versões do aplicativo.
- O Atlas vivo deve ser sempre o espelho do sistema atual. Na mesma entrega, refletir nele as alterações de telas, textos, navegação, componentes, estilos, estados e interações representadas. Atualizar apenas o número da versão não basta.
- Conferir a correspondência entre implementação e Atlas antes de concluir a entrega. Preservar a identificação explícita de funcionalidades planejadas e de dados ilustrativos; não apresentar planejamento como funcionalidade implementada.
- Preservar versões e datas dos registros históricos. Atualizar as indicações vigentes sem reescrever o histórico.
- Incluir o versionamento e as alterações correspondentes do Atlas no mesmo conjunto de entrega do sistema. Quando commit e push estiverem autorizados, publicar esse conjunto junto.
- Não afirmar que uma versão foi implantada ou verificada em produção sem confirmação. Distinguir a versão atual do código da situação da implantação.
- Mudanças exclusivamente documentais, sem alteração no sistema ou em sua representação no Atlas, não exigem incremento da versão.

## Conferência final da entrega

- Revisar o diff final e confirmar que o resultado atende ao pedido, preserva alterações anteriores e não inclui arquivos temporários ou segredos.
- Conferir implementação, Atlas, versão e documentação como um único conjunto, aplicando a exceção de versão para mudanças exclusivamente documentais.
- Informar ao usuário o resultado, as validações realizadas, as pendências reais e a situação de publicação. Referenciar os arquivos e registros relevantes; não anunciar como concluído o que depende de uma ação ou comprovação ainda pendente.

Estas diretrizes permanecem válidas para as próximas entregas, salvo orientação explícita diferente do usuário.

## Regra permanente de fechamento dos modais

- Todos os modais atuais e futuros devem fechar por clique ou toque fora da caixa, além de X e Escape. Reutilizar ActionDialog e o comportamento global DialogBackdropDismiss, montado no layout raiz; diálogos nativos novos recebem automaticamente a mesma regra.
- Um gesto deve começar e terminar fora do mesmo diálogo. Conteúdo/padding e arraste iniciado dentro não fecham; modais aninhados fecham somente o superior. Manter foco e callbacks/regras de cancelamento já definidos por cada formulário, sem executar confirmação destrutiva por fechar.
- Qualquer nova implementação de modal deve ser conferida em desktop/celular e sincronizada no Atlas com essa regra. Não criar um modal paralelo que ignore o comportamento compartilhado.

## Autorização permanente de publicação — 07/11/2026

- Por instrução explícita do usuário, pedidos de commit e push neste projeto também autorizam colocar o conjunto em produção. Após enviar ao GitHub, acompanhar o deploy e conferir o site público; não deixar a entrega apenas no GitHub por padrão.
- Reutilizar verificações recentes pertinentes para poupar créditos, sem dispensar o build necessário da hospedagem e a confirmação do resultado. Registros exclusivamente documentais após um deploy já confirmado podem usar [skip netlify] para evitar build redundante. Novas despesas, credenciais e aceites legais continuam sujeitos às regras próprias.
