/**
 * Service to load and rank facts from the static ALYSSA_FACTS repository.
 */
class FactsService {
    /**
     * Loads facts allowed for a specific context (e.g. 'resume' or 'cover_letter').
     */
    static getAllowedFacts(context: 'resume' | 'cover_letter' | 'outreach'): any[] {
        return ALYSSA_FACTS.facts_repo.filter((fact: any) => fact.allowed[context]);
    }

    /**
     * Ranks facts based on overlap with Job Description requirements.
     */
    static rankFactsByRelevance(roleKey: string, requirements: string[], requiredCount: number): string[] {
        const role = ALYSSA_FACTS.roles.find((r: any) => r.role_key === roleKey);
        if (!role) return [];

        const allowedFacts = this.getAllowedFacts('resume').filter(f => role.allowed_fact_ids.includes(f.fact_id));

        // Normalize JD requirements into lowercase tags
        const jdSet = new Set(requirements.flatMap(r => r.toLowerCase().split(/\s+/)));

        // Score facts
        const scoredFacts = allowedFacts.map(fact => {
            let score = 0;
            fact.tags.forEach((tag: string) => {
                if (jdSet.has(tag.toLowerCase())) score += 2; // Direct tag match
                if (requirements.some(req => req.toLowerCase().includes(tag.toLowerCase()))) score += 1; // Partial match
            });
            return { fact, score };
        });

        // Sort by score descending
        scoredFacts.sort((a, b) => b.score - a.score);

        // Fill up to required count, return their raw text strings
        const topFacts = scoredFacts.slice(0, requiredCount).map(sf => sf.fact.text);

        // Pad with placeholders if deficient
        while (topFacts.length < requiredCount) {
            topFacts.push("[MISSING FACT] - No relevant fact found to populate this bullet");
        }

        return topFacts;
    }

    /**
     * Build the skills string dynamically based on groupings.
     */
    static buildSkillsString(): string {
        const groups: any = ALYSSA_FACTS.skills.groups;
        const allSkills: string[] = [];
        for (const cat in groups) {
            allSkills.push(...groups[cat]);
        }
        return allSkills.slice(0, ALYSSA_FACTS.skills.max_items).join(" • ");
    }

    /**
     * Build the pro summary string
     */
    static buildProSummary(requirements: string[]): string {
        const jdSet = new Set(requirements.flatMap(r => r.toLowerCase().split(/\s+/)));
        const pool = ALYSSA_FACTS.positioning.summary_sentence_pool;

        const scored = pool.map((s: any) => {
            let score = 0;
            s.tags.forEach((tag: string) => {
                if (jdSet.has(tag.toLowerCase()) || requirements.some(req => req.toLowerCase().includes(tag.toLowerCase()))) {
                    score++;
                }
            });
            return { text: s.text, score };
        });

        scored.sort((a: any, b: any) => b.score - a.score);
        return scored.slice(0, ALYSSA_FACTS.template_placeholder_map.PRO_SUMMARY.max_sentences).map((s: any) => s.text).join(" ");
    }
}
