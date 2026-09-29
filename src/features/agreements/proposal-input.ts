export type AgreementProposalInput = {
  category: string;
  title: string;
  description: string;
  timing: string;
  frequency: string;
};

export function parseAgreementProposal(input: AgreementProposalInput): AgreementProposalInput | null {
  const proposal = {
    category: input.category,
    title: input.title.trim(),
    description: input.description.trim(),
    timing: input.timing.trim(),
    frequency: input.frequency.trim(),
  };
  if (!['habit', 'experience'].includes(proposal.category)
    || !proposal.title || proposal.title.length > 100
    || !proposal.description || proposal.description.length > 500
    || !proposal.timing || proposal.timing.length > 120
    || !proposal.frequency || proposal.frequency.length > 120) return null;
  return proposal;
}
