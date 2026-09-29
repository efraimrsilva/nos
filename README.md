# Projeto Nós

**Versão vigente do projeto:** 0.7.0

Um espaço privado para cultivar vínculos saudáveis.

## Executar o aplicativo

Na raiz de um clone deste repositório, instale as dependências e inicie o aplicativo:

```powershell
npm ci
npm run dev
```

Neste workspace local, entre primeiro na pasta do aplicativo:

```powershell
cd "G:\Efraim\Dev\PROJETOS\Projeto Nós"
cd .\nos
npm run dev
```

Mantenha o terminal aberto para acompanhar as alterações em tempo real; `Ctrl+C` encerra o servidor. Se aparecer aviso de que já existe um servidor Next.js, use o que está em `http://127.0.0.1:3000` ou encerre a instância anterior no terminal em que ela foi aberta antes de iniciar outra.

Abra http://127.0.0.1:3000. A primeira tela é **Escolher caminho** (`/comecar`). Criar um Núcleo abre **Tipo de Núcleo** (`/comecar/tipo`), com nove tipos e escolha obrigatória. **Propósito** (`/comecar/proposito`) permite preencher nome, usar uma sugestão editável e conferir um rascunho local. A escolha do tipo é preservada ao voltar. O rascunho não é salvo antes da ação explícita **Criar Núcleo**; sair da página ou recarregar o descarta.

As rotas de conta, criação protegida, convite e a primeira Home protegida estão implementadas. A Home mostra dados reais do Núcleo e do vínculo próprio. Sem Supabase configurado, as rotas protegidas não simulam cadastro, Núcleo ou convite. O fluxo de conta e associação foi validado com contas reais no projeto de desenvolvimento `nos-dev`; a Home também foi acessada nas sessões usadas para testar a agenda. O aplicativo não foi publicado.

A agenda interna em `/nucleos/[id]/agenda` está concluída na v0.6.0. A migração `20260927221149_create_nucleus_calendar` foi aplicada e conferida no `nos-dev`; criação, resposta, edição, remoção e negativa de acesso a outro Núcleo foram validadas com duas contas. O Núcleo e o evento temporários usados nos testes foram removidos.

A Tela 04 de Acordos em `/nucleos/[id]/acordos` está concluída na v0.7.0. Há propostas reais de Hábitos e Experiências, respostas individuais e entrada em teste somente por aceite unânime; recusa encerra a proposta. Essência apresenta estado vazio, sem progresso simulado. A migração `20260928120000_create_nucleus_agreements` foi aplicada ao `nos-dev`; três contas temporárias validaram aceite, recusa e isolamento, e os dados de teste foram removidos. O aplicativo ainda não foi publicado.

## Configurar Supabase

1. O projeto de desenvolvimento `nos-dev` já foi criado na organização **Projetos Efraim**. Guarde a senha do banco fora do repositório.
2. A **Project URL** e a **publishable key** já estão em `.env.local` neste ambiente, ignorado pelo Git. Em outro ambiente, copie `.env.example` para `.env.local` e preencha essas variáveis. Não use uma secret key ou `service_role` no app.
3. Em **Authentication → URL Configuration**, o Site URL local `http://127.0.0.1:3000` e o retorno `/auth/confirm` já foram salvos. O template padrão de confirmação usa `{{ .ConfirmationURL }}`; SMTP próprio será necessário antes de uso público.
4. As migrações `20260927173656_create_nuclei_and_invitations`, `20260927221149_create_nucleus_calendar` e `20260928120000_create_nucleus_agreements` já foram aplicadas e conferidas no `nos-dev`. **Não as reaplique nesse projeto.** Em um novo projeto, use as migrações versionadas em `supabase/migrations/`: autentique a CLI, vincule o projeto correto, revise `npx supabase db push --dry-run` e só então aplique `npx supabase db push`.
5. O fluxo de cadastro/confirmação, criação, convite, prévia, aceite e leitura condicionada à associação foi validado com duas contas distintas no ambiente de desenvolvimento.

O valor `<id-do-projeto>` aparece na URL `https://supabase.com/dashboard/project/<id-do-projeto>`. A CLI pode pedir a senha do banco no terminal; não a registre em arquivos ou mensagens. Neste ambiente, a inspeção HTTPS do Avast exigiu uma exceção de domínio para `api.supabase.com`; após a correção, a CLI 2.118.0 aplicou a migração de Acordos e confirmou o histórico remoto. O envio de e-mail padrão do Supabase tem limites de teste, então configure SMTP próprio antes de uso público.
No PowerShell que bloqueie `npx.ps1`, execute os mesmos comandos com `npx.cmd`.

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
- [v0.1.0 — Escolher caminho](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md)
- [v0.2.0 — Tipo de Núcleo](<Documentacao_Projeto_Nos/_andamento/registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>)
- [v0.3.0 — Propósito do Núcleo](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md)
- [v0.4.0 — Autenticação, criação e convite](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md)
- [v0.5.0 — Home do Núcleo](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md)
- [v0.6.0 — Agenda interna](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md)
- [v0.7.0 — Acordos](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md)

---

## Licença
