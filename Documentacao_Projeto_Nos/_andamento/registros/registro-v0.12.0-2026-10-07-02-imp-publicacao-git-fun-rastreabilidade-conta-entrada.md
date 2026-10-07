# Registro — v0.12.0 — 2026-10-07 — Imp. de publicação Git com Fun. de rastreabilidade de Conta e entrada

**Versão:** 0.12.0. **Status:** conjunto commitado e inspecionado; push normal autorizado para main, com verificação remota no encerramento.

## Objetivo e escopo

Usuário autorizou commit e push para o GitHub com descrição abrangente de tudo desenvolvido. Publicar em main a implementação completa de Conta e entrada, integração de recuperação/confirmacão, segurança, testes, configuração versionada, Atlas vivo sincronizado, galeria e documentação. Incluída a revisão documental de autenticação/segurança v2.8 anteriormente pendente, preservando seus requisitos futuros explicitamente sinalizados.

## Conjunto e decisões

Seis telas: Conta, Criar conta, Confirmar e-mail, Recuperar acesso, Redefinir senha e Entrada afetiva opcional. Novas rotas, retorno ao convite, recuperação com prova assinada vinculada à sessão, respostas neutras, revogação de renovação das sessões e proteção dos logs. Atlas: fichas/rotas/estados/jornada, inventário, seis telas com galeria antes/atlas/app e 18 capturas. Versão 0.12.0, contratos, plano, registros, histórico, BRAG e continuidade.

Apenas arquivos versionáveis; segredo de servidor, .env.local, artifacts, dependências, builds, resultados de teste e configuração remota temporária não entram no commit. Nenhuma mudança nova no produto por esta publicação; versão mantida. Segredo e entrega de e-mail no destino de publicação permanecem requisitos operacionais.

## Validação e controle Git

Antes da preparação: fetch de origin confirmou main sem divergência (0/0), base 45e2f69ca297254de9dde7b02d55cd8717390a3d. Suíte repetida nesta publicação: 108/108 aprovados; tipos/build já aprovados no conjunto funcional final. Inspecionar índice e objeto do commit; verificar que o hash de main remoto é idêntico ao HEAD após push. Limpeza do diretório sozinha não comprova conteúdo publicado. Revisão do produto realizada na entrega anterior; esta publicação usa autorrevisão dos registros e do conjunto.

## Resultado e continuidade

Objeto inicial conferido: árvore idêntica ao índice preparado (00497e25c2239b3aab404a9af9181cc294f162c4). Captura histórica da tela 72 corrigida após inspeção e incorporada ao mesmo commit juntamente com a atualização destes registros. Pendência removida após comprovar inclusão dos arquivos. Conjunto final tem 74 arquivos. O hash definitivo será reportado na resposta e recuperável por git log. Push para GitHub não comprova deploy. Próximo passo operacional: remetente/SMTP, segredo e URLs HTTPS no destino de publicação; próximo módulo planejado: Nossa Árvore com contrato real.
