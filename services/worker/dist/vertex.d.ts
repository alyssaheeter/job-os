import { AgentSukiPayload } from '@jhos/shared';
export declare function invokeJDNormalizer(rawText: string): Promise<any>;
/**
 * Invoke Agent Suki, attempting one retry if schema validation fails.
 */
export declare function invokeAgentSuki(jdText: string, factsData: any): Promise<AgentSukiPayload>;
