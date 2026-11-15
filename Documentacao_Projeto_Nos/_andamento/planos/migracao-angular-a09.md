# A09 — Agenda na prévia Angular

1. Conferir as telas 14–17 no Atlas vivo e reproduzir a falta da rota Angular com teste autenticado.
2. Portar leitura paginada, mês, semana e detalhe para `apps/web/src/app/calendar/`. Reutilizar validadores e cálculo de faixas independentes de React. Ligar rota, navegação e eventos do Início.
3. Portar criação, resposta, edição e remoção com funções existentes do Supabase. Conferir permissão de gestão, confirmação, horários e respostas após remarcação.
4. Validar em computador e celular, executar verificações do banco e sincronizar Atlas e continuidade. Manter versão Next.js e não publicar a prévia nesta etapa.

Angular Material oferece calendário, mas introduz dependências, estilos e adaptação do calendário existente. O seletor nativo de data é menor, porém não permite reproduzir os marcadores e os seletores consistentes de mês e ano. A escolha é um componente Angular dedicado, com botões e seletores nativos, rótulos em português e navegação de dias por teclado. O cálculo de faixas permanece compartilhado.
