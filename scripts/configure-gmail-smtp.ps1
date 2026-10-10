param(
    [string]$CliPath,
    [switch]$Check
)

$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskWorkdir = Join-Path $taskRoot 'supabase/operacao/gmail'
$taskExpectedRef = 'pyvohqgcwkcfzbtkmbvx'
$taskRefFile = Join-Path $taskRoot 'supabase/.temp/project-ref'
if (!(Test-Path -LiteralPath $taskRefFile) -or [IO.File]::ReadAllText($taskRefFile).Trim() -ne $taskExpectedRef) {
    throw 'O projeto local precisa estar vinculado ao nos-dev esperado. Confira supabase link antes de configurar SMTP.'
}

if (!$CliPath) {
    $taskCommand = Get-Command supabase -ErrorAction SilentlyContinue
    if ($taskCommand) { $CliPath = $taskCommand.Source }
    else {
        # Reaproveita a CLI instalada, sem baixar uma versão diferente durante uma operação sensível.
        $taskCache = Join-Path $env:LOCALAPPDATA 'npm-cache/_npx'
        $taskCandidates = Get-ChildItem -LiteralPath $taskCache -Directory -ErrorAction SilentlyContinue |
            ForEach-Object { Join-Path $_.FullName 'node_modules/@supabase/cli-windows-x64/bin/supabase.exe' } |
            Where-Object { Test-Path -LiteralPath $_ }
        foreach ($taskCandidate in $taskCandidates) {
            if ((& $taskCandidate --version 2>$null) -eq '2.118.0') { $CliPath = $taskCandidate; break }
        }
    }
}
if (!$CliPath -or !(Test-Path -LiteralPath $CliPath)) { throw 'CLI Supabase não encontrada. Informe -CliPath com a instalação autenticada.' }
if ((& $CliPath --version 2>$null) -ne '2.118.0') { throw 'Use Supabase CLI 2.118.0, versão verificada para configuração parcial.' }

Write-Host 'Projeto: nos-dev. Remetente/usuário: sintagmasoftware@gmail.com. Nome: Nós. SMTP: smtp.gmail.com:587.'
$taskPreviousPassword = $env:NOS_GMAIL_SMTP_PASSWORD
$taskPointer = [IntPtr]::Zero
try {
    if ($Check) {
        # Somente leitura: valor fictício permite validar o TOML e acesso à configuração sem ativar SMTP.
        $env:NOS_GMAIL_SMTP_PASSWORD = 'abcdefghijklmnop'
    }
    else {
        $taskSecurePassword = Read-Host 'Cole a senha de app do Gmail (não a senha normal)' -AsSecureString
        $taskPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskSecurePassword)
        $env:NOS_GMAIL_SMTP_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskPointer).Replace(' ', '')
        if ($env:NOS_GMAIL_SMTP_PASSWORD -notmatch '^[^\s]{16}$') { throw 'A senha de app deve ter 16 caracteres; espaços de apresentação são removidos.' }
    }

    # A CLI pode incluir credenciais no diff. Captura apenas em memória e nunca imprime a saída bruta.
    $taskResult = & $CliPath config diff --project-ref $taskExpectedRef --workdir $taskWorkdir --output-format json 2>$null
    if ($LASTEXITCODE -ne 0) { throw 'Não foi possível conferir a configuração. Verifique login da CLI e acesso de rede ao Supabase.' }
    $taskDiff = ($taskResult -join "`n") | ConvertFrom-Json
    $taskAllowedFields = @('enabled', 'host', 'port', 'user', 'pass', 'admin_email', 'sender_name') |
        ForEach-Object { "auth.email.smtp.$_" }
    if ($taskDiff.target.project_ref -ne $taskExpectedRef) { throw 'A CLI retornou um projeto diferente do esperado.' }
    # O diff lista também campos não declarados, apenas para comparação. Eles não podem entrar no push parcial.
    $taskUnexpected = @($taskDiff.changes | Where-Object {
        $_.declared -eq $true -and ($_.path -join '.') -notin $taskAllowedFields
    })
    if ($taskUnexpected.Count) { throw 'A configuração declara mudanças fora de SMTP. Operação bloqueada para revisão.' }
    if ($Check) { Write-Host 'Configuração isolada e acesso remoto conferidos. Nenhum campo remoto foi alterado.'; return }

    # Executar este script sem -Check aplica somente os parâmetros SMTP declarados no arquivo isolado.
    $taskResult = & $CliPath config push --project-ref $taskExpectedRef --workdir $taskWorkdir --yes --output-format json 2>$null
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao aplicar SMTP. Confira os parâmetros no painel Supabase antes de repetir.' }
    Write-Host 'Configuração SMTP aplicada. Teste o recebimento e a recuperação antes de considerar o envio certificado.'
}
finally {
    $env:NOS_GMAIL_SMTP_PASSWORD = $taskPreviousPassword
    $taskResult = $null
    $taskDiff = $null
    if ($taskPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskPointer) }
    if ($taskSecurePassword) { $taskSecurePassword.Dispose() }
}
