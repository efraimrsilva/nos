import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "supabase/templates");
export const messages = JSON.parse(readFileSync(path.join(directory, "catalog.json"), "utf8"));
export const escapeHtml = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function renderEmail(message) {
  const e = escapeHtml;
  const action = message.action ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0"><tr><td bgcolor="#345d44" style="border-radius:8px;text-align:center"><a href="${e(message.href)}" style="display:inline-block;padding:16px 24px;border:1px solid #345d44;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:24px;color:#ffffff;text-decoration:none">${e(message.action)}</a></td></tr></table>` : "";
  const fallback = message.href === "{{ .ConfirmationURL }}" ? `<p style="margin:20px 0 0;font-size:13px;line-height:21px;color:#657368">Se o botão não abrir, copie e cole este link no navegador:</p><p style="margin:6px 0 0;font-size:12px;line-height:20px;word-break:break-all;overflow-wrap:anywhere"><a href="{{ .ConfirmationURL }}" style="color:#345d44;text-decoration:underline">{{ .ConfirmationURL }}</a></p>` : "";
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${e(message.subject)}</title></head>
<body style="margin:0;padding:0;width:100%;background-color:#f5f7f1;color:#293e35;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%">
<div style="display:none;font-size:1px;line-height:1px;color:#f5f7f1;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all">${e(message.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f7f1"><tr><td align="center" style="padding:32px 16px">
<!--[if mso]><table role="presentation" width="600" align="center"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px"><tr><td style="padding:0 4px 24px"><a href="{{ .SiteURL }}" aria-label="Nós — início" style="font-family:Georgia,serif;font-size:42px;font-weight:bold;line-height:48px;letter-spacing:-2px;text-decoration:none;color:#293e35">nós<span style="color:#7955a5">.</span></a><p style="margin:6px 0 0;font-size:13px;line-height:20px;color:#657368">Pequenos gestos. Vínculos reais.</p></td></tr>
<tr><td bgcolor="#fffefa" style="padding:32px 24px;border:1px solid #dce3d6;border-top:4px solid #345d44;border-radius:12px">
<p style="margin:0 0 16px;font-size:11px;font-weight:bold;letter-spacing:2px;line-height:18px;color:#345d44">${e(message.eyebrow)}</p>
<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:30px;font-weight:normal;line-height:38px;color:#293e35">${e(message.title)}</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:26px">Olá,</p>
${message.paragraphs.map(paragraph => `<p style="margin:0 0 16px;font-size:16px;line-height:26px">${e(paragraph)}</p>`).join("\n")}
${message.code ? `<p style="margin:28px 0;padding:20px 12px;border:1px solid #dce3d6;border-radius:8px;background-color:#eef3e8;font-family:Arial,Helvetica,sans-serif;font-size:32px;font-weight:bold;line-height:40px;letter-spacing:6px;text-align:center;color:#293e35">${e(message.code)}</p>` : ""}
${action}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#eef3e8" style="padding:16px;border-left:3px solid #345d44;font-size:13px;line-height:22px;color:#43584b">${e(message.notice)}</td></tr></table>
${fallback}
<p style="margin:28px 0 0;font-size:15px;line-height:24px;color:#43584b">Com cuidado,<br><strong>Equipe Nós</strong></p>
</td></tr><tr><td style="padding:24px 4px 0;font-size:12px;line-height:20px;color:#657368"><p style="margin:0 0 6px">Precisa de ajuda? <a href="mailto:sintagmasoftware@gmail.com" style="color:#345d44;text-decoration:underline">Fale com a nossa equipe</a>.</p><p style="margin:0">Nós · Sintagma Software</p></td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>\n`;
}

export function managementPayload() {
  return Object.fromEntries(messages.flatMap(message => {
    const key = message.id + (message.category === "notification" ? "_notification" : "");
    return [[`mailer_subjects_${key}`, message.subject], [`mailer_templates_${key}_content`, renderEmail(message)]];
  }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const message of messages) writeFileSync(path.join(directory, `${message.id}.html`), renderEmail(message));
  const blocks = prefix => messages.map(message => `[auth.email.${message.category}.${message.id}]\nsubject = ${JSON.stringify(message.subject)}\ncontent_path = "${prefix}/${message.id}.html"`).join("\n\n");
  const local = path.join(root, "supabase/config.toml");
  const marker = "# BEGIN NOS AUTH EMAILS";
  const config = readFileSync(local, "utf8").split(marker)[0].trimEnd();
  writeFileSync(local, `${config}\n\n${marker}\n# Modelos não ativam notificações nem novos fluxos de acesso.\n${blocks("./supabase/templates")}\n# END NOS AUTH EMAILS\n`);
  console.log(`${messages.length} modelos gerados; configuração local atualizada. Publicação pela API usa apenas assuntos e HTMLs.`);
}
