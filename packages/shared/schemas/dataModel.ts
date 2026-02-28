import { z } from 'zod';
export const FactEntrySchema = z.object({
    fact_id: z.string(),
    outcome_metric: z.string(),
    mechanism: z.string(),
    scope: z.string(),
    tooling: z.string(),
    role: z.string(),
    tags: z.array(z.string()),
    verified: z.boolean(),
    proof_uri: z.string().optional(),
    last_updated: z.string().optional()
});

export type FactEntry = z.infer<typeof FactEntrySchema>;

export const JobSchema = z.object({
    jobId: z.string(),
    tenantId: z.string(),
    source: z.object({
        channel: z.string(),
        url: z.string().optional(),
        posting_date: z.string().optional(),
        posting_age: z.number().optional(),
        applicant_count_hint: z.number().optional()
    }),
    company: z.object({
        industry: z.string(),
        stage: z.string(),
        size: z.string(),
        hq: z.string(),
        scale_friction_signals: z.array(z.string()),
        evidence_excerpts: z.array(z.string())
    }),
    role: z.object({
        title: z.string(),
        role_family: z.string(),
        seniority: z.string(),
        employment_type: z.string(),
        manager_title_hint: z.string().optional()
    }),
    location: z.object({
        work_mode: z.enum(['remote', 'hybrid', 'onsite', 'unknown']),
        geo_requirement: z.string(),
        onsite_days: z.number(),
        travel_percent: z.number(),
        excerpt: z.string()
    }),
    compensation: z.object({
        base_min: z.number().optional(),
        base_max: z.number().optional(),
        ote_min: z.number().optional(),
        ote_max: z.number().optional(),
        split: z.string().optional(),
        equity: z.boolean(),
        confidence: z.enum(['high', 'low']),
        excerpt_lines: z.array(z.string()),
        missing_fields: z.array(z.string())
    }),
    ats_requirements: z.object({
        must_haves: z.array(z.string()),
        nice_to_haves: z.array(z.string()),
        tools_platforms: z.array(z.string()),
        domains: z.array(z.string()),
        keywords_to_mirror: z.array(z.string()),
        validated_skill_clusters: z.array(z.object({
            cluster: z.string(),
            terms: z.array(z.string())
        }))
    }),
    scope_signals: z.object({
        discovery_ownership: z.boolean(),
        demo_expectation: z.boolean(),
        enterprise_motion: z.boolean(),
        cross_functional: z.boolean(),
        revops_component: z.boolean()
    }),
    risk_flags: z.object({
        pure_ae: z.boolean(),
        demo_monkey_risk: z.boolean(),
        internal_it_support: z.boolean(),
        heavy_travel: z.boolean(),
        comp_below_floor: z.boolean()
    }),
    raw_storage: z.object({
        gcs_uri: z.string(),
        content_hash: z.string()
    }),
    versions: z.object({
        normalizer_version: z.string(),
        rubric_version: z.string(),
        prompt_version: z.string()
    }),
    timestamps: z.object({
        ingested_at: z.string(),
        updated_at: z.string()
    })
});

export type Job = z.infer<typeof JobSchema>;

export const ScoringRunSchema = z.object({
    runId: z.string(),
    jobId: z.string(),
    tenantId: z.string(),
    inputHash: z.string(),
    status: z.enum(['RUNNING', 'SUCCESS', 'FAILED']),
    total_score: z.number().optional(),
    breakdown_per_category: z.object({
        salesEngineerFit: z.number(),
        compensation: z.number(),
        technicalDepth: z.number(),
        dealComplexity: z.number(),
        remote: z.number(),
        revenueScope: z.number(),
        industry: z.number()
    }).optional(),
    evidence_from_jd: z.array(z.string()).optional(),
    evidence_from_facts: z.array(z.string()).optional(),
    unknown_fields: z.array(z.string()).optional(),
    risks: z.array(z.string()).optional(),
    keywords_to_mirror: z.array(z.string()).optional(),
    generatedAt: z.string()
});

export type ScoringRun = z.infer<typeof ScoringRunSchema>;

export const PromptRunLogSchema = z.object({
    logId: z.string(),
    runId: z.string(),
    tenantId: z.string(),
    timestamp: z.string(),
    model: z.string(),
    promptType: z.string(),
    requestPayload: z.any(),
    responsePayload: z.any(),
    error: z.string().optional(),
    schemaViolation: z.boolean().default(false)
});

export type PromptRunLog = z.infer<typeof PromptRunLogSchema>;
