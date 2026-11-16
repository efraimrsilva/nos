import manifest from '../../package.json' with {type:'json'};
import { handlePreviewProblemReport } from '../../../../src/features/support/preview-handler.mjs';
import { createPreviewMail, readPreviewConfig } from '../preview-mail.mjs';

export default function problemReport(request) {
  return handlePreviewProblemReport(request,{
    config:readPreviewConfig(process.env),
    async getSender() {
      const mail = await createPreviewMail(process.env);
      return mail ? (report,email) => mail.sendReport(report,email,manifest.version) : null;
    },
  });
}
