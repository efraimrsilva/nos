import manifest from '../../package.json' with {type:'json'};
import { handlePreviewProblemReport } from '../../../../src/features/support/preview-handler.mjs';
import { createHostedMail, readHostedConfig, selectMailMode } from '../preview-mail.mjs';

export default function problemReport(request,context) {
  const mode = selectMailMode(process.env,request,context);
  return handlePreviewProblemReport(request,{
    config:readHostedConfig(process.env,mode),
    async getSender() {
      const mail = await createHostedMail(process.env,mode);
      return mail ? (report,email) => mail.sendReport(report,email,manifest.version) : null;
    },
  });
}
