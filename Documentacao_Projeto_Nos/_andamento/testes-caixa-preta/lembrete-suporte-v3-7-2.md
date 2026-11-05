# Lembrete de suporte no cabeçalho — v3.7.2

Registre os resultados em [resultados.md](resultados.md).

| ID | Caminho e pré-condição | Ação | Resultado esperado | Status |
|---|---|---|---|---|
| M05-SUP-010 | Aba nova → Conta autenticada | Navegar entre telas, rolar o conteúdo e aguardar completar um minuto | O ícone expande sem deslocar sino e perfil. Após 10 s, recolhe e continua acionável. | Não executado |
| M05-SUP-011 | Aba nova → Conta autenticada → Aviso expandido | Clicar ou pressionar Enter no botão. Fechar com Escape. | Abre Relatar um problema na rota atual. O foco volta ao ícone e o aviso já consumido não retorna após recarregar. | Não executado |
| M05-SUP-012 | Conta autenticada em aba nova | Deixar a aba em segundo plano por mais de um minuto e voltar. Depois, sair e entrar novamente na mesma aba. | Na volta à aba, o aviso ganha 10 s para aparecer. Após entrar novamente, o minuto começa do zero. | Não executado |
