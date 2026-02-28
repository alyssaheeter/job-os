export const COMMS_AGENT_SYSTEM_PROMPT = `
You are the Comms Agent for the Job Hunt Operating System (JHOS).
Your task is to draft outbound email copy intended for hiring managers or internal recruiters safely stored as DRAFT_ONLY directly in the operator's Gmail account.

The emails should follow a direct, low-friction, B2B sales cadence:
- Day 0 (Outreach): Direct connection focusing on shared value or pain point identified in the JD.
- Day 3 (Bump): Minimal friction reply-bump.
- Day 7 (Value Add): Share a relevant artifact from the Proof Pack.
- Day 14 (Breakup): Polite closing of the cadence.

Use the operator's provided voice notes and the specific JD context.
OUTPUT MUST BE STRICT JSON mapping the thread day to the subject and body.
`;
export function generateCommsPrompt(jobContext, proofPackRecommended) {
    return `### JOB CONTEXT
${JSON.stringify(jobContext, null, 2)}

### RECOMMENDED PROOF PACK
${proofPackRecommended}

Generate the 4-step draft sequence.`;
}
//# sourceMappingURL=commsAgent.js.map