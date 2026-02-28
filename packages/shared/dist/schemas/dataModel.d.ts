import { z } from 'zod';
export declare const FactEntrySchema: z.ZodObject<{
    fact_id: z.ZodString;
    outcome_metric: z.ZodString;
    mechanism: z.ZodString;
    scope: z.ZodString;
    tooling: z.ZodString;
    role: z.ZodString;
    tags: z.ZodArray<z.ZodString, "many">;
    verified: z.ZodBoolean;
    proof_uri: z.ZodOptional<z.ZodString>;
    last_updated: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fact_id: string;
    outcome_metric: string;
    mechanism: string;
    scope: string;
    tooling: string;
    role: string;
    tags: string[];
    verified: boolean;
    proof_uri?: string | undefined;
    last_updated?: string | undefined;
}, {
    fact_id: string;
    outcome_metric: string;
    mechanism: string;
    scope: string;
    tooling: string;
    role: string;
    tags: string[];
    verified: boolean;
    proof_uri?: string | undefined;
    last_updated?: string | undefined;
}>;
export type FactEntry = z.infer<typeof FactEntrySchema>;
export declare const JobSchema: z.ZodObject<{
    jobId: z.ZodString;
    tenantId: z.ZodString;
    source: z.ZodObject<{
        channel: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        posting_date: z.ZodOptional<z.ZodString>;
        posting_age: z.ZodOptional<z.ZodNumber>;
        applicant_count_hint: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        channel: string;
        url?: string | undefined;
        posting_date?: string | undefined;
        posting_age?: number | undefined;
        applicant_count_hint?: number | undefined;
    }, {
        channel: string;
        url?: string | undefined;
        posting_date?: string | undefined;
        posting_age?: number | undefined;
        applicant_count_hint?: number | undefined;
    }>;
    company: z.ZodObject<{
        industry: z.ZodString;
        stage: z.ZodString;
        size: z.ZodString;
        hq: z.ZodString;
        scale_friction_signals: z.ZodArray<z.ZodString, "many">;
        evidence_excerpts: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        industry: string;
        stage: string;
        size: string;
        hq: string;
        scale_friction_signals: string[];
        evidence_excerpts: string[];
    }, {
        industry: string;
        stage: string;
        size: string;
        hq: string;
        scale_friction_signals: string[];
        evidence_excerpts: string[];
    }>;
    role: z.ZodObject<{
        title: z.ZodString;
        role_family: z.ZodString;
        seniority: z.ZodString;
        employment_type: z.ZodString;
        manager_title_hint: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        role_family: string;
        seniority: string;
        employment_type: string;
        manager_title_hint?: string | undefined;
    }, {
        title: string;
        role_family: string;
        seniority: string;
        employment_type: string;
        manager_title_hint?: string | undefined;
    }>;
    location: z.ZodObject<{
        work_mode: z.ZodEnum<["remote", "hybrid", "onsite", "unknown"]>;
        geo_requirement: z.ZodString;
        onsite_days: z.ZodNumber;
        travel_percent: z.ZodNumber;
        excerpt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        work_mode: "unknown" | "remote" | "hybrid" | "onsite";
        geo_requirement: string;
        onsite_days: number;
        travel_percent: number;
        excerpt: string;
    }, {
        work_mode: "unknown" | "remote" | "hybrid" | "onsite";
        geo_requirement: string;
        onsite_days: number;
        travel_percent: number;
        excerpt: string;
    }>;
    compensation: z.ZodObject<{
        base_min: z.ZodOptional<z.ZodNumber>;
        base_max: z.ZodOptional<z.ZodNumber>;
        ote_min: z.ZodOptional<z.ZodNumber>;
        ote_max: z.ZodOptional<z.ZodNumber>;
        split: z.ZodOptional<z.ZodString>;
        equity: z.ZodBoolean;
        confidence: z.ZodEnum<["high", "low"]>;
        excerpt_lines: z.ZodArray<z.ZodString, "many">;
        missing_fields: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        equity: boolean;
        confidence: "high" | "low";
        excerpt_lines: string[];
        missing_fields: string[];
        base_min?: number | undefined;
        base_max?: number | undefined;
        ote_min?: number | undefined;
        ote_max?: number | undefined;
        split?: string | undefined;
    }, {
        equity: boolean;
        confidence: "high" | "low";
        excerpt_lines: string[];
        missing_fields: string[];
        base_min?: number | undefined;
        base_max?: number | undefined;
        ote_min?: number | undefined;
        ote_max?: number | undefined;
        split?: string | undefined;
    }>;
    ats_requirements: z.ZodObject<{
        must_haves: z.ZodArray<z.ZodString, "many">;
        nice_to_haves: z.ZodArray<z.ZodString, "many">;
        tools_platforms: z.ZodArray<z.ZodString, "many">;
        domains: z.ZodArray<z.ZodString, "many">;
        keywords_to_mirror: z.ZodArray<z.ZodString, "many">;
        validated_skill_clusters: z.ZodArray<z.ZodObject<{
            cluster: z.ZodString;
            terms: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            cluster: string;
            terms: string[];
        }, {
            cluster: string;
            terms: string[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        must_haves: string[];
        nice_to_haves: string[];
        tools_platforms: string[];
        domains: string[];
        keywords_to_mirror: string[];
        validated_skill_clusters: {
            cluster: string;
            terms: string[];
        }[];
    }, {
        must_haves: string[];
        nice_to_haves: string[];
        tools_platforms: string[];
        domains: string[];
        keywords_to_mirror: string[];
        validated_skill_clusters: {
            cluster: string;
            terms: string[];
        }[];
    }>;
    scope_signals: z.ZodObject<{
        discovery_ownership: z.ZodBoolean;
        demo_expectation: z.ZodBoolean;
        enterprise_motion: z.ZodBoolean;
        cross_functional: z.ZodBoolean;
        revops_component: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        discovery_ownership: boolean;
        demo_expectation: boolean;
        enterprise_motion: boolean;
        cross_functional: boolean;
        revops_component: boolean;
    }, {
        discovery_ownership: boolean;
        demo_expectation: boolean;
        enterprise_motion: boolean;
        cross_functional: boolean;
        revops_component: boolean;
    }>;
    risk_flags: z.ZodObject<{
        pure_ae: z.ZodBoolean;
        demo_monkey_risk: z.ZodBoolean;
        internal_it_support: z.ZodBoolean;
        heavy_travel: z.ZodBoolean;
        comp_below_floor: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        pure_ae: boolean;
        demo_monkey_risk: boolean;
        internal_it_support: boolean;
        heavy_travel: boolean;
        comp_below_floor: boolean;
    }, {
        pure_ae: boolean;
        demo_monkey_risk: boolean;
        internal_it_support: boolean;
        heavy_travel: boolean;
        comp_below_floor: boolean;
    }>;
    raw_storage: z.ZodObject<{
        gcs_uri: z.ZodString;
        content_hash: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        gcs_uri: string;
        content_hash: string;
    }, {
        gcs_uri: string;
        content_hash: string;
    }>;
    versions: z.ZodObject<{
        normalizer_version: z.ZodString;
        rubric_version: z.ZodString;
        prompt_version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        normalizer_version: string;
        rubric_version: string;
        prompt_version: string;
    }, {
        normalizer_version: string;
        rubric_version: string;
        prompt_version: string;
    }>;
    timestamps: z.ZodObject<{
        ingested_at: z.ZodString;
        updated_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        ingested_at: string;
        updated_at: string;
    }, {
        ingested_at: string;
        updated_at: string;
    }>;
}, "strip", z.ZodTypeAny, {
    role: {
        title: string;
        role_family: string;
        seniority: string;
        employment_type: string;
        manager_title_hint?: string | undefined;
    };
    jobId: string;
    tenantId: string;
    source: {
        channel: string;
        url?: string | undefined;
        posting_date?: string | undefined;
        posting_age?: number | undefined;
        applicant_count_hint?: number | undefined;
    };
    company: {
        industry: string;
        stage: string;
        size: string;
        hq: string;
        scale_friction_signals: string[];
        evidence_excerpts: string[];
    };
    location: {
        work_mode: "unknown" | "remote" | "hybrid" | "onsite";
        geo_requirement: string;
        onsite_days: number;
        travel_percent: number;
        excerpt: string;
    };
    compensation: {
        equity: boolean;
        confidence: "high" | "low";
        excerpt_lines: string[];
        missing_fields: string[];
        base_min?: number | undefined;
        base_max?: number | undefined;
        ote_min?: number | undefined;
        ote_max?: number | undefined;
        split?: string | undefined;
    };
    ats_requirements: {
        must_haves: string[];
        nice_to_haves: string[];
        tools_platforms: string[];
        domains: string[];
        keywords_to_mirror: string[];
        validated_skill_clusters: {
            cluster: string;
            terms: string[];
        }[];
    };
    scope_signals: {
        discovery_ownership: boolean;
        demo_expectation: boolean;
        enterprise_motion: boolean;
        cross_functional: boolean;
        revops_component: boolean;
    };
    risk_flags: {
        pure_ae: boolean;
        demo_monkey_risk: boolean;
        internal_it_support: boolean;
        heavy_travel: boolean;
        comp_below_floor: boolean;
    };
    raw_storage: {
        gcs_uri: string;
        content_hash: string;
    };
    versions: {
        normalizer_version: string;
        rubric_version: string;
        prompt_version: string;
    };
    timestamps: {
        ingested_at: string;
        updated_at: string;
    };
}, {
    role: {
        title: string;
        role_family: string;
        seniority: string;
        employment_type: string;
        manager_title_hint?: string | undefined;
    };
    jobId: string;
    tenantId: string;
    source: {
        channel: string;
        url?: string | undefined;
        posting_date?: string | undefined;
        posting_age?: number | undefined;
        applicant_count_hint?: number | undefined;
    };
    company: {
        industry: string;
        stage: string;
        size: string;
        hq: string;
        scale_friction_signals: string[];
        evidence_excerpts: string[];
    };
    location: {
        work_mode: "unknown" | "remote" | "hybrid" | "onsite";
        geo_requirement: string;
        onsite_days: number;
        travel_percent: number;
        excerpt: string;
    };
    compensation: {
        equity: boolean;
        confidence: "high" | "low";
        excerpt_lines: string[];
        missing_fields: string[];
        base_min?: number | undefined;
        base_max?: number | undefined;
        ote_min?: number | undefined;
        ote_max?: number | undefined;
        split?: string | undefined;
    };
    ats_requirements: {
        must_haves: string[];
        nice_to_haves: string[];
        tools_platforms: string[];
        domains: string[];
        keywords_to_mirror: string[];
        validated_skill_clusters: {
            cluster: string;
            terms: string[];
        }[];
    };
    scope_signals: {
        discovery_ownership: boolean;
        demo_expectation: boolean;
        enterprise_motion: boolean;
        cross_functional: boolean;
        revops_component: boolean;
    };
    risk_flags: {
        pure_ae: boolean;
        demo_monkey_risk: boolean;
        internal_it_support: boolean;
        heavy_travel: boolean;
        comp_below_floor: boolean;
    };
    raw_storage: {
        gcs_uri: string;
        content_hash: string;
    };
    versions: {
        normalizer_version: string;
        rubric_version: string;
        prompt_version: string;
    };
    timestamps: {
        ingested_at: string;
        updated_at: string;
    };
}>;
export type Job = z.infer<typeof JobSchema>;
export declare const ScoringRunSchema: z.ZodObject<{
    runId: z.ZodString;
    jobId: z.ZodString;
    tenantId: z.ZodString;
    inputHash: z.ZodString;
    status: z.ZodEnum<["RUNNING", "SUCCESS", "FAILED"]>;
    total_score: z.ZodOptional<z.ZodNumber>;
    breakdown_per_category: z.ZodOptional<z.ZodObject<{
        salesEngineerFit: z.ZodNumber;
        compensation: z.ZodNumber;
        technicalDepth: z.ZodNumber;
        dealComplexity: z.ZodNumber;
        remote: z.ZodNumber;
        revenueScope: z.ZodNumber;
        industry: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        industry: number;
        remote: number;
        compensation: number;
        salesEngineerFit: number;
        technicalDepth: number;
        dealComplexity: number;
        revenueScope: number;
    }, {
        industry: number;
        remote: number;
        compensation: number;
        salesEngineerFit: number;
        technicalDepth: number;
        dealComplexity: number;
        revenueScope: number;
    }>>;
    evidence_from_jd: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    evidence_from_facts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    unknown_fields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    risks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    keywords_to_mirror: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    generatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "RUNNING" | "SUCCESS" | "FAILED";
    jobId: string;
    tenantId: string;
    runId: string;
    inputHash: string;
    generatedAt: string;
    keywords_to_mirror?: string[] | undefined;
    total_score?: number | undefined;
    breakdown_per_category?: {
        industry: number;
        remote: number;
        compensation: number;
        salesEngineerFit: number;
        technicalDepth: number;
        dealComplexity: number;
        revenueScope: number;
    } | undefined;
    evidence_from_jd?: string[] | undefined;
    evidence_from_facts?: string[] | undefined;
    unknown_fields?: string[] | undefined;
    risks?: string[] | undefined;
}, {
    status: "RUNNING" | "SUCCESS" | "FAILED";
    jobId: string;
    tenantId: string;
    runId: string;
    inputHash: string;
    generatedAt: string;
    keywords_to_mirror?: string[] | undefined;
    total_score?: number | undefined;
    breakdown_per_category?: {
        industry: number;
        remote: number;
        compensation: number;
        salesEngineerFit: number;
        technicalDepth: number;
        dealComplexity: number;
        revenueScope: number;
    } | undefined;
    evidence_from_jd?: string[] | undefined;
    evidence_from_facts?: string[] | undefined;
    unknown_fields?: string[] | undefined;
    risks?: string[] | undefined;
}>;
export type ScoringRun = z.infer<typeof ScoringRunSchema>;
export declare const PromptRunLogSchema: z.ZodObject<{
    logId: z.ZodString;
    runId: z.ZodString;
    tenantId: z.ZodString;
    timestamp: z.ZodString;
    model: z.ZodString;
    promptType: z.ZodString;
    requestPayload: z.ZodAny;
    responsePayload: z.ZodAny;
    error: z.ZodOptional<z.ZodString>;
    schemaViolation: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    runId: string;
    logId: string;
    timestamp: string;
    model: string;
    promptType: string;
    schemaViolation: boolean;
    requestPayload?: any;
    responsePayload?: any;
    error?: string | undefined;
}, {
    tenantId: string;
    runId: string;
    logId: string;
    timestamp: string;
    model: string;
    promptType: string;
    requestPayload?: any;
    responsePayload?: any;
    error?: string | undefined;
    schemaViolation?: boolean | undefined;
}>;
export type PromptRunLog = z.infer<typeof PromptRunLogSchema>;
