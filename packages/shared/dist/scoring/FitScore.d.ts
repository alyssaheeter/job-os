import { Job } from '../schemas/dataModel.js';
export interface RubricScores {
    salesEngineerFit: number;
    compensation: number;
    technicalDepth: number;
    dealComplexity: number;
    remote: number;
    revenueScope: number;
    industry: number;
}
/**
 * Calculates the overall FitScore.
 * Inputs to this function should be normalized between 0.0 and 1.0
 * based on the Vertex AI extraction outputs.
 */
export declare function calculateFitScore(rubricScores: RubricScores): number;
export declare const MIN_FITSCORE_THRESHOLD = 80;
export declare function isQualified(score: number): boolean;
export declare function evaluateThreshold(score: number): 'AUTO_APPLY' | 'MANUAL_REVIEW' | 'SKIP';
export declare function checkDisqualifiers(job: Job): {
    disqualified: boolean;
    reasons: string[];
};
