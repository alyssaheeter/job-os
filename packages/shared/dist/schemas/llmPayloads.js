import { z } from 'zod';
import { FactEntrySchema } from './dataModel.js';
export const AgentSukiPayloadSchema = z.object({
    summary: z.string().describe('The PRO_SUMMARY output'),
    independent_consultancy_bullets: z.array(FactEntrySchema).max(5).describe('The INDEPENDENT_CONSULTANCY_BULLET_1-5 output formatted as facts'),
    ahead_bullets: z.array(FactEntrySchema).max(5).describe('The AHEAD_BULLET_1-5 output formatted as facts'),
    att_cse_bullets: z.array(FactEntrySchema).max(5).describe('The ATT_CSE_BULLET_1-5 output formatted as facts'),
    att_b2b_bullets: z.array(FactEntrySchema).max(5).describe('The ATT_B2B_BULLET_1-5 output formatted as facts'),
    skills: z.array(z.string()).describe('The SKILLS block'),
    reasoning: z.string().describe('Abductive reasoning explaining why these selections fit this role.')
});
//# sourceMappingURL=llmPayloads.js.map