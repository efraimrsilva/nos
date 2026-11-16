import "server-only";

import manifest from "../../../package.json";
import type { ProblemReportInput } from "./input";
import { sendProblemReport as send, supportMailTransport } from "./mail-transport";

export { sendNewAccountNotification, supportMailTransport } from "./mail-transport";

export function sendProblemReport(mail: NonNullable<ReturnType<typeof supportMailTransport>>, input: ProblemReportInput, accountEmail: string) {
  return send(mail, input, accountEmail, manifest.version);
}
