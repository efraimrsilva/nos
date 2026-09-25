# Projeto Nós

**Versão vigente do projeto:** 0.2.0

Um espaço privado para cultivar vínculos saudáveis.

## Executar o aplicativo

Na raiz de um clone deste repositório, instale as dependências e inicie o aplicativo:

```powershell
npm ci
npm run dev
```

Neste workspace local, as dependências já estão instaladas e há um lançador na pasta principal `Projeto Nós`; você pode iniciar dali com o mesmo comando:

```powershell
cd "G:\Efraim\Dev\PROJETOS\Projeto Nós"
npm run dev
```

O `package.json` da pasta principal encaminha o comando para o aplicativo em `nos` e fica fora deste repositório Git. Mantenha o terminal aberto para acompanhar as alterações em tempo real; `Ctrl+C` encerra o servidor. Se aparecer aviso de que já existe um servidor Next.js, use o que está em `http://127.0.0.1:3000` ou encerre a instância anterior no terminal em que ela foi aberta antes de iniciar outra.

Abra http://127.0.0.1:3000. A primeira tela é **Escolher caminho** (`/comecar`). Criar um Núcleo abre **Tipo de Núcleo** (`/comecar/tipo`), com nove tipos, escolha obrigatória e continuidade para o espaço reservado de Propósito. A escolha é preservada ao voltar de Propósito. Convite permanece preparatório; nenhum Núcleo é criado. Autenticação e Supabase não estão integrados nesta entrega.

Para as verificações, use a pasta `nos`, que é a raiz deste repositório Git. Neste workspace, se estiver na pasta principal `Projeto Nós`, execute `cd .\nos`; em um clone do GitHub, permaneça na raiz do clone. Depois:

```powershell
npx playwright install chromium
npm test
npm run typecheck
npm run build
```

No ambiente Windows em que ocorrer `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, o uso dos certificados confiáveis do sistema foi verificado com `$env:NODE_USE_SYSTEM_CA='1'` antes de instalar. Não desabilite a validação TLS.

Código: `src/app` (rotas), `src/features/onboarding` (componentes do fluxo) e `src/shared` (navegação). Testes de comportamento em `tests`. Fontes e imagem da árvore servidas localmente. Consulte [frontend](Documentacao_Projeto_Nos/_andamento/tecnologias/frontend.md) e [primeira tela](Documentacao_Projeto_Nos/_andamento/funcionalidades/escolher-caminho.md) para limites e próximos passos.

---

## Estrutura de Documentação

A documentação está organizada em três categorias principais:

### 1.x - Visão e Regras de Negócio
Documentos que definem a filosofia, as regras de negócio e os conceitos fundamentais do projeto.

- [v1.1 - Visão e Regras de Negócio](Documentacao_Projeto_Nos/Projeto_Nos_v1.1_Visao_e_Regras_de_Negocio.md)
- [v1.2 - Sistema de Aprovação e Construção de Acordos](Documentacao_Projeto_Nos/Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md)
- [v1.3 - Evolução para Núcleos](Documentacao_Projeto_Nos/Projeto_Nos_v1.3_Evolucao_Para_Nucleos.md)
- [v1.4 - Sistema de Impacto](Documentacao_Projeto_Nos/Projeto_Nos_v1.4_Sistema_de_Impacto.md)
- [v1.5 - Sistema de Reconhecimento e Gratidão](Documentacao_Projeto_Nos/Projeto_Nos_v1.5_Sistema_de_Reconhecimento_e_Gratidao.md)
- [v1.6 - Sistema de Marcos de Evolução e Celebrações Saudáveis](Documentacao_Projeto_Nos/Projeto_Nos_v1.6_Sistema_de_Marcos_de_Evolucao_e_Celebracoes_Saudaveis.md)
- [v1.7 - Sistema de Linguagens de Cuidado e Amor](Documentacao_Projeto_Nos/Projeto_Nos_v1.7_Sistema_de_Linguagens_de_Cuidado_e_Amor.md)
- [v1.8 - Manifesto do Núcleo](Documentacao_Projeto_Nos/Projeto_Nos_v1.8_Manifesto_do_Nucleo.md)
- [v1.9 - Calendário do Núcleo e Sincronização Segura](Documentacao_Projeto_Nos/Projeto_Nos_v1.9_Calendario_do_Nucleo_e_Sincronizacao_Segura.md)
- [v1.10 - Sistema de Conversas Guiadas e Mediação Afetiva](Documentacao_Projeto_Nos/Projeto_Nos_v1.10_Sistema_de_Conversas_Guiadas_e_Mediacao_Afetiva.md)

### 2.x - Interface e Implementação
Documentos que definem as telas, fluxos, design system e regras de implementação.

- [v2.0 - Alinhamento das Telas com a Documentação](Documentacao_Projeto_Nos/Projeto_Nos_v2.0_Alinhamento_das_Telas_com_a_Documentacao.md)
- [v2.1 - Catálogo Completo das Interfaces](Documentacao_Projeto_Nos/Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md)
- [v2.2 - Fluxos, Navegação e Interações](Documentacao_Projeto_Nos/Projeto_Nos_v2.2_Fluxos_Navegacao_e_Interacoes.md)
- [v2.3 - Design System, Componentes e Tom de Interface](Documentacao_Projeto_Nos/Projeto_Nos_v2.3_Design_System_Componentes_e_Tom_de_Interface.md)
- [v2.4 - Modelo Funcional, Dados, Estados e Regras](Documentacao_Projeto_Nos/Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md)
- [v2.5 - Matriz de Permissões, Privacidade e Visibilidade](Documentacao_Projeto_Nos/Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md)
- [v2.6 - Estados Vazios, Erros e Carregamento](Documentacao_Projeto_Nos/Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md)
- [v2.7 - Notificações e Eventos do Sistema](Documentacao_Projeto_Nos/Projeto_Nos_v2.7_Notificacoes_e_Eventos_do_Sistema.md)
- [v2.8 - Autenticação e Segurança](Documentacao_Projeto_Nos/Projeto_Nos_v2.8_Autenticacao_e_Seguranca.md)

### 3.x - Técnica e Arquitetura
Documentos técnicos sobre arquitetura, infraestrutura e implementação.

*(Ainda não há documentos nesta categoria)*

### Andamento
Registro persistente das decisões, do estado atual e das próximas ações do projeto.

- [Índice de andamento](Documentacao_Projeto_Nos/_andamento/README.md)
- [Estado atual](Documentacao_Projeto_Nos/_andamento/estado.md)
- [v0.2.0 — Tipo de Núcleo](<Documentacao_Projeto_Nos/_andamento/registros/registro-v0.2.0-2026-09-25-imp-tela-tipo-nucleo-fun-selecao-vinculo-01.md>)

---

## Licença
