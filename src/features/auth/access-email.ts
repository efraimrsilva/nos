type Kind = "recovery";
type EmailResult = { error: { status?: number } | null };

export async function sendAccessEmail(kind: Kind, send: () => Promise<EmailResult>, reportFailure: () => void) {
  // O Auth pode falhar no SMTP somente para uma conta existente. Até essa falha
  // precisa ter a mesma resposta pública para impedir descoberta de cadastros.
  try {
    const { error } = await send();
    if (error) reportFailure();
  } catch { reportFailure(); }
  return "Se houver uma conta para este e-mail, enviaremos as instruções de recuperação. Confira também o spam.";
}
