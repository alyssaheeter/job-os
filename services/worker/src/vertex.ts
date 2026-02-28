import { VertexAI, Schema, SchemaType } from '@google-cloud/vertexai';
import { config } from './config.js';
import {
    AgentSukiPayload,
    AgentSukiPayloadSchema
} from '@jhos/shared';
import {
    AGENT_SUKI_SYSTEM_PROMPT,
    generateSukiPrompt,
    JD_NORMALIZER_SYSTEM_PROMPT,
    generateNormalizerPrompt,
    EVALUATOR_SYSTEM_PROMPT,
    generateEvaluatorPrompt
} from '@jhos/prompts';
import { EvaluatorResultSchema, EvaluatorResultSchemaType } from '@jhos/shared';

// Initialize Vertex with config
const vertex_ai = new VertexAI({ project: config.projectId, location: config.region });

// For now we map zod to the strict object schema Vertex expects.
// Because the JSON validation happens natively via zod on response,
// we provide a schema structure to give the model a hint or use responseSchema.
const responseSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        summary: { type: SchemaType.STRING },
        independent_consultancy_bullets: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    fact_id: { type: SchemaType.STRING },
                    outcome_metric: { type: SchemaType.STRING },
                    mechanism: { type: SchemaType.STRING },
                    scope: { type: SchemaType.STRING },
                    tooling: { type: SchemaType.STRING },
                    role: { type: SchemaType.STRING },
                    tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    verified: { type: SchemaType.BOOLEAN }
                },
                required: ['fact_id', 'outcome_metric', 'mechanism', 'scope', 'tooling', 'role', 'verified', 'tags']
            }
        },
        ahead_bullets: { type: SchemaType.ARRAY }, // Simplified for vertex schema hint
        att_cse_bullets: { type: SchemaType.ARRAY },
        att_b2b_bullets: { type: SchemaType.ARRAY },
        skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        reasoning: { type: SchemaType.STRING }
    },
    required: [
        'summary',
        'independent_consultancy_bullets',
        'ahead_bullets',
        'att_cse_bullets',
        'att_b2b_bullets',
        'skills',
        'reasoning'
    ]
};

const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: config.geminiModel,
    generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1
    },
    systemInstruction: AGENT_SUKI_SYSTEM_PROMPT
});

const normalizerModel = vertex_ai.preview.getGenerativeModel({
    model: config.geminiModel,
    generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
    },
    systemInstruction: JD_NORMALIZER_SYSTEM_PROMPT
});

const evaluatorModel = vertex_ai.preview.getGenerativeModel({
    model: config.geminiModel,
    generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
    },
    systemInstruction: EVALUATOR_SYSTEM_PROMPT
});

export async function invokeJDNormalizer(rawText: string): Promise<any> {
    const prompt = generateNormalizerPrompt(rawText);
    const req = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };

    try {
        const response = await normalizerModel.generateContent(req);
        const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No text returned by normalizer");
        return JSON.parse(text);
    } catch (err) {
        console.warn("Retrying normalizer schema mapping...", err);
        const req2 = { contents: [{ role: 'user', parts: [{ text: prompt + "\\n\\nThe previous attempt failed JSON validation. Ensure valid JSON output." }] }] };
        const response2 = await normalizerModel.generateContent(req2);
        const text2 = response2.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text2) throw new Error("No text returned by normalizer on retry");
        return JSON.parse(text2);
    }
}

export async function invokeEvaluatorAgent(normalizedJobJson: string): Promise<EvaluatorResultSchemaType> {
    const prompt = generateEvaluatorPrompt(normalizedJobJson);
    const req = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };

    try {
        const response = await evaluatorModel.generateContent(req);
        const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No text returned by evaluator");
        const json = JSON.parse(text);
        return EvaluatorResultSchema.parse(json);
    } catch (err) {
        console.warn("Retrying evaluator schema mapping...", err);
        const req2 = { contents: [{ role: 'user', parts: [{ text: prompt + "\\n\\nThe previous attempt failed JSON validation. Ensure valid output." }] }] };
        const response2 = await evaluatorModel.generateContent(req2);
        const text2 = response2.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text2) throw new Error("No text returned by evaluator on retry");
        return EvaluatorResultSchema.parse(JSON.parse(text2));
    }
}

/**
 * Invoke Agent Suki using optionally cached context for the Facts.
 */
export async function invokeAgentSuki(jdText: string, factsData: any): Promise<AgentSukiPayload> {
    // V2 Execution: In a fully productionized setup, we'd use vertex_ai.preview.cachedContents.create
    // For this build, we implement the structure required for the cache invocation by passing 
    // the canonical rules and facts together cleanly.

    let cacheHit = false;
    let inputTokens = 0;

    const prompt = generateSukiPrompt(jdText, JSON.stringify(factsData));

    // First Attempt
    try {
        const res = await callModel(prompt);
        return AgentSukiPayloadSchema.parse(res);
    } catch (err) {
        console.warn("First LLM attempt failed schema validation. Retrying...", err);
        // Second Attempt
        const res2 = await callModel(prompt + "\\n\\nThe previous attempt failed JSON validation. Ensure valid JSON matching the schema.");
        return AgentSukiPayloadSchema.parse(res2); // Hard fail if second attempt breaks
    }
}

async function callModel(prompt: string): Promise<any> {
    const req = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
    };
    const response = await generativeModel.generateContent(req);
    const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error("No text returned by Gemini");
    }
    return JSON.parse(text);
}
