# Testes SQL do modelo substituído — v0.16.0

Os cinco arquivos desta pasta foram preservados sem alteração de conteúdo ao substituir votações por administração e participação individual. Eles descrevem o banco até a migração 20261013150000; não são a suíte vigente contra a migração administrativa posterior.

A suíte atual fica em ../tests e cobre o novo modelo, o isolamento, os convites e a impossibilidade de chamar RPCs antigas de votação. Manter testes que exigem funções intencionalmente revogadas na pasta ativa faria supabase test db falhar pelo contrato antigo. Para reproduzir história, usar banco descartável com as sete primeiras migrações; nunca fazer rollback do banco de uso para executar esses testes.
