# Registro — v0.13.0 — 2026-10-07 — Imp. de publicação Git com Fun. rastreabilidade da navegação protegida

**Status:** Conjunto commitado e objeto inspecionado; envio ao GitHub autorizado. Versão funcional 0.13.0 preservada.

## Objetivo, contexto e escopo

Publicar um único commit lógico abrangendo toda a entrega de navegação protegida e entrada por Seus Núcleos. Antes, o onboarding podia abrir sem sessão e o login retornava ao início da criação; agora a entrada autenticada permite escolher associações reais e retomar destinos privados permitidos.

Inclui validação de sessão no proxy, cookies/cache e redirecionamento de formulários expirados; lista real /nucleos sob RLS, paginação e estados; retornos da Conta/Início; testes de regressão e integração local; Atlas vivo, Visão global, percursos, fichas e galeria antes/depois; contratos conceituais, README, frontend, continuidade e Brag; manifestos na versão 0.13.0.

## Decisões e controles

- Usuário autorizou commit e push para GitHub com descrição abrangente; deploy não incluído.
- Branch main; base 71310978b56fb1b425b163bba04b89a5f18d270a. Fetch confirmou HEAD e origin/main sem divergência (0/0).
- Preservar um commit atômico com implementação, testes e documentação. Credenciais, caches, dependências e artefatos temporários permanecem ignorados. Configuração original do Supabase restaurada; nenhuma migração ou alteração remota de banco.
- Inspecionar o objeto do commit e comparar sua árvore com o conjunto preparado antes de remover a pendência. Conferir HEAD e hash de main remoto após o push; o resultado final será comunicado no encerramento e pode ser reconferido pelo Git.

## Validação

Entrega: 88 testes sem backend e 44 autenticados em desktop/celular; tipos/build aprovados. Atlas: 72 prévias, 180 saídas, 360 estados, 14 percursos; Visão global compartilhada e galeria de dez imagens aprovadas. Revisão independente e autorrevisão concluídas; 809 links locais e diff sem erro. Suíte sem backend repetida antes da publicação: 88/88 aprovados. Uma execução anterior teve 87 aprovações e timeout na primeira abertura de Boas-vindas; trace mostrou navegação de cerca de 33 segundos. Prazo específico de compilação ampliado para 90 segundos, mantendo todas as asserções; repetição completa aprovada. 813 links locais da documentação/README e diff preparados conferidos.

## Resultado e continuidade

Commit inspecionado: 82 alterações com renomes reconhecidos; árvore inicial 86556e8d92ac93a10e5dd9823a9c37132413b078 idêntica ao conjunto preparado. Implementação, testes, imagens e documentação incluídos; nenhum arquivo operacional ou credencial. Pendência removida após essa prova e controle incorporado ao mesmo commit. Conferir HEAD contra main remoto após o push; hash final comunicado no encerramento. Detalhes funcionais e limites no [registro da implementação](registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md). Mensagem e corpo do commit descrevem o conjunto final; versão preservada nesta publicação.

Publicação no GitHub não comprova deploy. Próximo passo de produto permanece fechar fontes e contrato da Tela 38 Nossa Árvore; lançamento exige conferir SMTP, segredo e retornos HTTPS no ambiente escolhido.
