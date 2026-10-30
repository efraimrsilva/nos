# Registro — v3.3.1 — 2026-10-29 — Imp. de conta e perfil com Fun. navegação contextual

**Status:** conjunto validado e incorporado ao commit de produto desta entrega, com inclusão dos fontes, teste autenticado e registro comprovada no objeto Git. Fechamento incorporado antes do primeiro push autorizado. Igualdade remota conferida no encerramento; deploy não certificado.
**Versão vigente:** 3.3.1 nos manifestos e Atlas. O HEAD anterior indicava 3.4.0, mas os arquivos locais já tinham sido realinhados a 3.3.1 antes desta publicação. A divergência é registrada sem renumerar registros históricos nem interpretar os números como prova de publicação.

## Objetivo, contexto e requisitos

Publicar o conjunto solicitado de melhorias da conta: preservar o último Núcleo, oferecer ações no perfil desktop, simplificar os controles repetidos e sincronizar o Atlas vivo. Alterações preexistentes de Aparência e diretrizes foram revisadas e preservadas. Nenhuma migração, dependência de aplicativo ou operação remota de banco foi adicionada.

## Decisões e implementação

- `ApplicationShell` mantém o último Núcleo em cookie de contexto deste navegador, com chave por conta. Abrir `/conta` ou recarregar preserva os destinos de Início, Acordos, Agenda e Pessoas. Antes de restaurar a seleção, o servidor confere a sessão e consulta o Núcleo pelas políticas de acesso atuais. Vínculos removidos não restauram nome nem atalhos; o cookie inválido é limpo. Falha de transporte não é confundida com vínculo removido. A lembrança depende de cookies disponíveis e não sincroniza dispositivos. Páginas e ações continuam validando associação no servidor.
- `AccountPopover` usa popover nativo, ancorado no topo direito no desktop, com abertura suave, rolagem interna, título acessível, Escape, clique externo e botão Fechar. Modais filhos mantêm foco e retornam ao mesmo painel. Mudar para celular ou navegar fecha o painel. Mobile oferece acesso à página completa.
- `AccountPreferences` é reutilizado na página e no popover. O painel mostra seis seções: Perfil, Entrar e recuperar, Conta e Núcleos, Aparência, Privacidade, Ajuda e suporte. Notificações e Apagar minha conta ficam somente na página completa, que mantém oito seções. IDs das seções do popover são distintos dos da página.
- A opção e o conteúdo redundantes de Conta e segurança foram removidos. Apagar minha conta tem bloco próprio ao final de `/conta`, mantendo formulário, alerta, frase APAGAR CONTA e ação de servidor existentes. Ajuda e Privacidade apontam ao novo bloco. A rota antiga continua protegida e encaminha a Entrar e recuperar.
- A busca do cabeçalho, seu modal, estado e estilos exclusivos foram removidos. Filtros de Acordos e busca da ferramenta Atlas permanecem.
- Blocos da conta recebem entrada suave em sequência e respeitam movimento reduzido. O seletor de temas mantém nove opções e feedback real após salvar; textos redundantes e reserva de espaço vazia foram retirados.
- Atlas reutiliza a mesma composição em ficha, MVP e Visão global. Tela 69 representa a confirmação de exclusão. Popover desktop, seis/oito seções, ausência da lupa, animações e fechamento acompanham o aplicativo. O diálogo da prévia permanece dentro do popover de origem para preservar o retorno.

## Arquivos e integrações

Componentes de conta/controles, `onboarding-shell.tsx`, `application-shell.tsx`, CSS de layout/animação/temas e metadados da rota antiga. Atlas: `product-ui.js`, `product.css`, `atlas.css`, `icons.js`, `screens.js`, `index.html`; manifestos, README, contratos e continuidade.

Sessão e preferência de privacidade reutilizam o cliente existente e a função `get_my_privacy_preference`; consultas de contagens e privacidade são paralelas e limitadas à requisição. Nenhuma chave privada é enviada aos componentes. O fluxo de exclusão não foi executado contra contas reais.

## Validações e evidências

- `npm run typecheck`: aprovado.
- `NOS_LOCAL_VERIFY=1 npm run build`: aprovado, saída isolada `.next-verify`, sem substituir o servidor de desenvolvimento.
- Seleção inicial de seis arquivos Playwright: 54 testes aprovados em desktop/celular.
- `npm run test:authenticated -- account-menu.spec.ts`: desktop aprovado; primeira rodada mobile falhou porque o teste navegava antes da hidratação. Acrescentada espera pela página interativa; repetição mobile aprovada. Não se atribui essa falha ao banco ou à autorização.
- Testes autenticados exercitam banco exclusivamente local, criação/limpeza de contas e Núcleos descartáveis, seis/oito seções, abertura/retorno de modais, gravação real de tema, exclusão desabilitada sem confirmação e troca/persistência do Núcleo. O teste apenas abre e cancela a exclusão.
- `npm run test:db`: 6 arquivos, 160 testes aprovados no banco local.
- `node scripts/verify-account-menu-atlas.mjs`: seis seções no painel, oito na página, nove temas, modais e larguras desktop/celular aprovados, sem erros de JavaScript.
- Verificadores `verify-mvp-view.mjs` e `verify-global-view.mjs`: aprovados após corrigir o comparador estrutural para considerar IDs únicos e atributos inertes de miniaturas e congelar frases aleatórias/relógio no ambiente do teste. A primeira falha e sua causa ficam preservadas neste registro; não houve ocultação de diferenças de conteúdo funcional.
- Autorrevisão de código/diff; revisão independente solicitada pela skill Superpowers, resultado registrado no fechamento. Sintaxe de scripts, CSS e diff conferidos. Resultado da suíte geral adicional será registrado no fechamento.

[Galeria](../../wireframes/comparacoes/v3.3.1-2026-10-29-conta-perfil-tela_13-tela_66-tela_69/index.html): aplicativo real com contas locais descartáveis e Atlas ilustrativo em 1440×1000 e 390×844. Não há captura anterior preservada desta composição; não foi fabricado um antes. Testes de caixa preta do usuário continuam Não executados no [roteiro](../testes-caixa-preta/conta-perfil.md).

## Ferramentas e limites

Superpowers: fonte oficial clonada fora do projeto em `C:/Users/efraimsilva/.codex/superpowers`, revisão `2ce8aa1`; skills de verificação, conclusão e depuração lidas e aplicadas manualmente. O procedimento oficial vigente indica o plugin do Codex, localizado como disponível, mas não instalado; sua ativação requer a interface do aplicativo. Não se declara descoberta automática ativa.

Context7 e Octocode não estavam disponíveis entre as ferramentas da sessão. Tentativas oficiais `npx -y @upstash/context7-mcp --help` e `npx -y octocode --help` falharam com ETIMEDOUT no registro npm; instalação/integração não confirmadas. Nenhuma dependência do projeto foi alterada por essas tentativas. Documentação e tipos locais existentes foram usados; não houve pesquisa avançada entre repositórios. Próximo passo de ferramentas: ativar Superpowers no aplicativo e repetir as instalações quando houver conectividade com o registro npm.

## Resultado e próximo passo

Conjunto preparado para publicação na main, com evidência local. Confirmar objetos Git e igualdade com origin/main após o push; depois conferir o deploy e executar o roteiro de testes de caixa preta com a própria conta. Push não comprova deploy ou fluxo em produção. Agenda e regras de domínio não foram alteradas; teste de bloqueios da agenda não se aplica a este recorte.

### Atualização de ferramentas durante o fechamento

O usuário informou a instalação global de Superpowers 7.0.1 e Context7 1.0.2. Os diretórios e as skills dessas versões foram conferidos em ~/.codex/plugins/cache; passou-se a usar as skills do plugin instalado. As ferramentas resolve-library-id/query-docs do Context7 continuam ausentes do inventário desta sessão: autenticação e consulta não foram comprovadas. Não reinstalar nem duplicar esses plugins; abrir nova sessão se necessário. As tentativas npm com timeout descritas acima ocorreram antes dessa confirmação. Octocode permanece indisponível.

### Suíte geral e sincronização dos testes

Primeira rodada npm test: 183 aprovados e uma falha mobile no teste de pausa das frases. Reteste isolado: pausa aprovada, mas teste do ciclo leu 199 frases distintas em vez de 200. O teste lia HTML antes de comprovar hidratação e avançava o relógio sem esperar o commit visual do React. Ajustadas somente as esperas dos testes, preservando o componente de frases. Repetição completa: 184 testes aprovados em 2,6 minutos; as falhas anteriores não são apagadas.

### Revisão independente e correção

Revisor independente encontrou P2 na restauração da seleção sem invalidar vínculo removido; revisão estática não constatou quebra da autorização. A solução deixou de confiar no localStorage e passou a consultar no servidor o identificador do cookie de contexto por pessoa, usando as políticas RLS (segurança por linha) existentes. Regressão autenticada acrescentada: perda da associação seguida de reload não exibe nome/atalhos antigos. Não foram alteradas políticas nem criada migração. Tipos aprovados após a correção; nova execução completa do arquivo autenticado aprovada em desktop e celular (2 testes, 54,2 segundos); segunda leitura independente aprovou a correção.

Segunda leitura independente: correção do P2 aprovada, sem novos achados importantes. Escopo de revisão estática declarado; fluxos autenticados executados pela tarefa principal. Documentação do ambiente global preservada no [registro de ferramentas](registro-v3.3.1-2026-10-29-imp-ferramentas-globais-fun-superpowers-context7.md).

### Fechamento da validação

Build isolado e tipos repetidos após a correção do vínculo: aprovados. O teste autenticado precisou trocar a espera por um botão do menu mobile por uma espera da seleção persistida: no desktop, esse botão está oculto e o streaming pode manter temporariamente duas composições. Foram falhas do seletor de prontidão do teste; rodada final dos dois projetos aprovada. Suíte geral anterior: 184 aprovados; banco: 160 aprovados. Atlas/MVP/Visão global aprovados e 12 imagens locais preservadas. Testes de caixa preta do usuário continuam não executados. Nenhum servidor do usuário foi encerrado, banco remoto alterado ou deploy certificado.

Unidade de diretrizes incluída separadamente no commit c6e1516. Nenhuma pendência de commit deste conjunto permanece após comprovar a inclusão no Git. A situação de deploy e a execução manual seguem independentes da publicação dos fontes.
