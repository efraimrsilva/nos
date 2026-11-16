import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { handlePreviewProblemReport } from '../src/features/support/preview-handler.mjs';

export function createSupportServer({url, publicKey, version, smtpPort}) {
  const getSender = async () => {
    if (!smtpPort) return null;
    // A prévia local usa uma caixa descartável no loopback.
    const {sendProblemReport, supportMailTransport} = await import('../src/features/support/mail-transport.ts');
    const mail = supportMailTransport({
      SUPPORT_SMTP_HOST:'127.0.0.1', SUPPORT_SMTP_PORT:smtpPort,
      SUPPORT_MAIL_FROM:'support@example.test', NOS_AUTH_TEST:'1',
    });
    return mail ? (report,email) => sendProblemReport(mail,report,email,version,'reports@example.test') : null;
  };
  return createServer(async (request, response) => {
    if (request.url !== '/api/problem-report') {
      response.writeHead(404, {'Cache-Control':'no-store'}).end();
      return;
    }
    try {
      const method = request.method;
      const body = method === 'GET' || method === 'HEAD' ? undefined : Readable.toWeb(request);
      const web = new Request('http://localhost/api/problem-report', {
        method, headers:request.headers, body, duplex:'half',
      });
      const result = await handlePreviewProblemReport(web,{config:{url,publicKey},getSender});
      response.writeHead(result.status,Object.fromEntries(result.headers));
      response.end(await result.text());
    } catch {
      if (!response.headersSent) response.writeHead(503, {'Cache-Control':'no-store'});
      response.end();
    } finally {
      // Uma rejeição precoce não deixa o corpo pendente na conexão HTTP local.
      request.resume();
    }
  });
}
