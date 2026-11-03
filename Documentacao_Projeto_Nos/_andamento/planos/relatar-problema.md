# Plano — v3.7.0 — relato de problemas — 2026-11-03

Objetivo autorizado: modal objetivo para reportar problemas por e-mail à equipe; destinatário oculto no cliente. Reutilizar ActionDialog e componentes existentes, sem publicar.

## Decisões e critérios de aceitação

- Acessos em Ajuda e suporte (Conta, perfil e Mais), conteúdo de orientação e cabeçalho autenticado.
- O que aconteceu? obrigatório (10–2000 caracteres); Como repetir? opcional (até1000). Sem anexos. Contexto: rota sem query/hash/identificadores, versão e e-mail da conta autenticada como contato. Aviso para não incluir senhas ou conteúdo íntimo.
- Envio pelo servidor via SMTP (serviço Brevo existente), destinatário fixo somente servidor. Nenhum mailto/destinatário no bundle/HTML.
- Validação de sessão e de campos no servidor; limite compartilhado de uma tentativa por minuto por conta em função transacional no banco, sem salvar conteúdo dos relatos.
- Estado pendente bloqueia duplicação; confirmação só após aceite SMTP; falha preserva texto. Modal reutiliza X/Escape/fechamento externo e foco existentes.

## Execução verificável

- [x] Capturar estado anterior e demonstrar teste de interface falhando por atalho inexistente.
- [x] Implementar leitor/validação, transporte SMTP, limite em migração local, ação e modal reutilizado nos acessos.
- [x] Testar entrega em SMTP local isolado, sessão, limites/concorrência, indisponibilidade, campos e sigilo do destinatário; desktop/mobile e Atlas.
- [x] Revisar diff e obter revisão independente; tipos/build; finalizar versão MINOR3.7.0 e registros/contrato/Atlas/caixa preta/Brag/continuidade.

## Arquivos previstos e limites

src/features/support/{input.ts,mail.ts,actions.ts,components/problem-report.tsx}; AccountPreferences, HelpContent e ApplicationShell; migração/teste SQL; testes autenticados/unidade e Atlas. Nodemailer justificado pelo transporte SMTP com TLS, timeouts e autenticação existentes.

Base main/a17052c, código atual3.6.3 com alterações anteriores de integrantes e sincronização preservadas. Credencial SMTP remota existente identificada por leitura autenticada da configuração; valores não exibidos. Conector Netlify indisponível. Configuração local e prova SMTP possíveis; provisionamento remoto/migração/deploy não autorizados nesta entrega. Não enviar e-mail de teste externo nem alegar recebimento real sem evidência. Testes usarão serviço SMTP local descartável.

Revisão independente, tipos/build e Atlas aprovados. Autenticação SMTP real aprovada após normalizar nomes das variáveis e usar nova chave de relatos. Versão3.7.0 finalizada localmente. Publicação fora do escopo; recebimento externo não certificado.
