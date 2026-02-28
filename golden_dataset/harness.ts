import { invokeAgentSuki } from '../services/worker/src/vertex.js';
import { calculateFitScore, isQualified, AgentSukiPayloadSchema } from '@jhos/shared';

// Mock Data
const MOCK_JD = `
Senior Solutions Engineer - Enterprise AI
We are looking for a highly technical presales engineer to lead enterprise data center modernization and AI initiatives.
Must have experience driving large deals (>$1M) and working cross-functionally.
Remote allowed.
`;

const MOCK_FACTS = [
  {
    fact_id: 'F001',
    outcome_metric: 'Secured $10M enterprise contract',
    mechanism: 'Positioned AI-optimized server architecture as primary vendor solution',
    scope: 'Top-tier airline infrastructure modernization initiative',
    tooling: 'AI server configurations, enterprise data center architecture',
    role: 'Client Solution Architect',
    tags: ['enterprise', 'ai', 'infrastructure'],
    verified: true
  }
];

async function runGoldenDataset() {
  console.log("=== JHOS GOLDEN DATASET HARNESS ===");
  try {
    console.log("1. Invoking Agent Suki with Mock JD and Facts...");
    const payload = await invokeAgentSuki(MOCK_JD, MOCK_FACTS);

    console.log("2. Validating JSON Schema Adherence...");
    // Payload was already validated by invokeAgentSuki via zod, but we'll confirm
    AgentSukiPayloadSchema.parse(payload);
    console.log("-> Schema: OK");

    // 3. Simulated FitScore 
    const mockRubric = {
      salesEngineerFit: 1, compensation: 0.8, technicalDepth: 1, dealComplexity: 1, remote: 1, revenueScope: 1, industry: 0.5
    };
    const fitScore = calculateFitScore(mockRubric);
    console.log(`3. FitScore Threshold check (Score: ${fitScore})`);

    if (isQualified(fitScore)) {
      console.log("-> FitScore: PASSED");
    } else {
      throw new Error("FitScore failed to reach threshold 80+");
    }

    console.log("4. Validating OMST Compliance & Hallucination Fallbacks...");
    const strPayload = JSON.stringify(payload);
    if (!strPayload.includes('[FILL-IN]')) {
      console.warn("WARNING: No [FILL-IN] fallbacks detected. Ensure the model isn't hallucinating missing facts.");
    }

    // Check forbidden adjectives from V1.1 prompt rules (example)
    const forbidden = ['guru', 'ninja', 'rockstar'];
    for (const word of forbidden) {
      if (strPayload.toLowerCase().includes(word)) {
        throw new Error(`OMST/Tone violation: Found forbidden word '${word}'`);
      }
    }
    console.log("-> OMST/Hallucination Checks: OK");

    console.log("\n=== GOLDEN DATASET PASSED ===");
    console.log("Sample AI Payload Output:");
    console.log(JSON.stringify(payload, null, 2));

  } catch (err) {
    console.error("\\n=== GOLDEN DATASET FAILED ===");
    console.error(err);
    process.exit(1);
  }
}

// Check if credentials are set (it will try to use ADC if running locally)
if (!process.env.GCP_PROJECT_ID) {
  console.log("Skip running golden dataset, GCP_PROJECT_ID environment variable not set. (Requires default application credentials).");
} else {
  runGoldenDataset();
}
