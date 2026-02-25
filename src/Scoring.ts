/**
 * Deterministic qualification scoring checking skills against the configured taxonomy.
 */
class ScoringService {
    /**
     * Calculates a match score based on overlap with configured target keywords.
     */
    static calculateQualificationScore(extractedRequirements: string[]): { score: number, matchedKeywords: string[] } {
        const rawKeywords = Config.get("TARGET_KEYWORDS");
        if (!rawKeywords) return { score: 0, matchedKeywords: [] };

        const targetKeywords = rawKeywords.split(",").map((k: string) => k.trim().toLowerCase());
        const matched: string[] = [];

        // Simple deterministic string match
        extractedRequirements.forEach(req => {
            const lowerReq = req.toLowerCase();
            targetKeywords.forEach((kw: string) => {
                if (lowerReq.includes(kw) && !matched.includes(kw)) {
                    matched.push(kw);
                }
            });
        });

        const score = targetKeywords.length > 0 ? (matched.length / targetKeywords.length) * 100 : 0;

        return {
            score: Math.round(score),
            matchedKeywords: matched
        };
    }
}
