# Diretrizes permanentes do projeto Nós

## Antes de iniciar qualquer entrega

- Ler este arquivo, conferir `git status` e identificar alterações locais existentes. Preservar o trabalho em andamento; não descartar, sobrescrever ou incluir mudanças alheias em uma publicação sem conferir seu escopo.
- Consultar `README.md`, `Documentacao_Projeto_Nos/_andamento/estado.md`, o plano em `Documentacao_Projeto_Nos/_andamento/planos/mvp.md` e os contratos da funcionalidade afetada. Ler os registros recentes relacionados antes de retomar uma tarefa.
- Na primeira leitura ou revisão das diretrizes gerais, percorrer toda a documentação do projeto: documentos conceituais 1.x/2.x, andamento, contratos, planos, registros, testes de caixa preta, guias do Atlas e documentação operacional. Nas retomadas, reler o estado e os documentos afetados; não tratar uma busca por palavras-chave como leitura integral. O arquivo `estado-atual.md` é histórico; a retomada canônica está em `estado.md`.
- Conferir informações documentadas com o código e as evidências disponíveis. Datas, versões e declarações antigas de situação não comprovam o estado atual. Registrar divergências e corrigir as indicações vigentes no escopo da entrega, preservando o histórico.
- Não presumir que o desenho aprovado já esteja implementado.
- Definir o resultado esperado, o recorte da mudança, as telas/rotas e regras afetadas e como validar o comportamento. Respeitar decisões explícitas do usuário; esclarecer apenas dúvidas que impeçam uma execução correta.

## Implementação e integridade do produto

- Antes de criar ou alterar uma interface, inspecionar seu desenho no modo Atlas vivo e ler a ficha, o percurso, as permissões e as pendências. Seguir `Documentacao_Projeto_Nos/wireframes/GUIA.md`; consultar somente o texto da ficha não substitui a revisão visual.
- Reutilizar componentes, estilos e regras existentes. Preservar a identidade visual, a linguagem de cuidado, a navegação desktop/mobile e a acessibilidade, incluindo teclado, foco, rótulos e estados de interação.
- Cobrir os estados aplicáveis: carregamento, vazio, sucesso, erro, falta de permissão e sessão expirada. Confirmar destinos, retorno, cancelamento e feedback das ações; evitar gravações duplicadas e mensagens de sucesso antes da confirmação da operação.
- Preservar privacidade, consentimento e isolamento entre contas e Núcleos. Validar autorização no servidor e no banco quando aplicável; ocultar um controle na interface não constitui proteção de acesso.
- Preservar os princípios do Nós: participação voluntária, possibilidade de recusar/adiar, ausência de ranking afetivo, punições por continuidade ou chat livre. IA e sugestões não substituem consentimento. Não inventar métricas de evolução, diagnósticos, prazos de retenção ou garantias operacionais.
- Consultar a documentação compatível com as versões instaladas antes de depender de APIs de bibliotecas. Usar Context7 quando disponível; complementar com documentação oficial, tipos e fontes locais quando a versão exata não estiver indexada. Para Next.js, conferir os guias instalados em `node_modules/next/dist/docs/`. Não afirmar uso de ferramentas indisponíveis nem instalar dependências apenas porque foram citadas em registros antigos.
- Não transformar exemplos, esboços ou etapas planejadas em funcionalidades anunciadas como prontas. Mudanças nas regras de domínio devem atualizar o contrato correspondente.

## Validação proporcional à mudança

- Para alterações de código do aplicativo, executar `npm run typecheck` e `npm run build`, além dos testes pertinentes ao comportamento alterado. Consultar os scripts de `package.json` e os verificadores existentes em `scripts/` antes de criar novos comandos.
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
- Sincronizar os contratos em `_andamento/funcionalidades/`, os roteiros em `_andamento/testes-caixa-preta/` e o plano MVP quando a mudança atingir regras, critérios, prioridades ou cobertura. Novos casos de caixa preta começam como não executados até haver evidência.
- Cada funcionalidade criada ou alterada exige ao menos um caso de caixa preta rastreável ao MVP/Expansão, com ID estável, caminho, pré-condição, ação e resultado esperado. Seguir `_andamento/testes-caixa-preta/README.md`; registrar cada execução/reteste em `resultados.md`, preservando falhas e diferenças de ambiente/dispositivo. Automação e correção de código não aprovam o teste de caixa preta do usuário.
- Atualizar as partes afetadas do Atlas: desenho, ficha, percursos, MVP, Visão global, cobertura e pendências. Preservar IDs estáveis e a reutilização das representações; conferir links e evitar cópias visuais divergentes.
- Todo modal afetado deve constar no Atlas, na ficha da tela, no registro e na galeria, com nome, gatilho, finalidade, permissão, resultado e situação real/esboço. Seguir `Documentacao_Projeto_Nos/_andamento/funcionalidades/modais-interface.md`; links entre rotas continuam classificados como navegação.
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
- Manter a mesma versão em `package.json`, na raiz e no pacote principal de `package-lock.json`, na indicação de versão vigente do `README.md` e na identificação visível do Atlas vivo em `Documentacao_Projeto_Nos/wireframes/atlas/index.html`.
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
