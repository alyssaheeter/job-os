/**
 * Orchestrator for Fact-Only Generation pipeline (Resume, Cover Letter, Outreach).
 */
class GenerationService {

    /**
     * Triggers the full artifact generation phase for an Opportunity.
     */
    static triggerGenerationPipeline(
        correlationId: string,
        opportunityId: string,
        company: string,
        role: string,
        requirements: string[],
        roleFolderId: string
    ) {
        try {
            // Navigate sub-folders based on scaffolds from DriveScaffoldService
            const parentFolder = DriveApp.getFolderById(roleFolderId);

            // Determine IDs for Draft folders logically by finding them
            let resumeFolderId = this.findOrFallback(parentFolder, "02_Resume_Drafts", roleFolderId);
            let coverFolderId = this.findOrFallback(parentFolder, "03_Cover_Letter_Drafts", roleFolderId);
            let outreachFolderId = this.findOrFallback(parentFolder, "04_Outreach_Drafts", roleFolderId);

            // --- RESUME ---
            const templateId = Config.get("RESUME_TEMPLATE_ID");
            let resumeUrl = "";
            let resumeTitle = `${company} - ${role} Tailored Resume`;

            if (templateId && templateId.length > 5) {
                // Build dynamic resume substitutions deterministically using ALYSSA_FACTS!
                const tokens: Record<string, string> = {};
                tokens["PRO_SUMMARY"] = FactsService.buildProSummary(requirements);
                tokens["SKILLS"] = FactsService.buildSkillsString();

                const roles = [
                    { key: "INDEPENDENT_CONSULTANCY", prefix: "INDEPENDENT_CONSULTANCY_BULLET_" },
                    { key: "AHEAD", prefix: "AHEAD_BULLET_" },
                    { key: "ATT_CSE", prefix: "ATT_CSE_BULLET_" },
                    { key: "ATT_B2B_SDR", prefix: "ATT_B2B_BULLET_" }
                ];

                for (const r of roles) {
                    const bullets = FactsService.rankFactsByRelevance(r.key, requirements, 5);
                    for (let i = 0; i < 5; i++) {
                        tokens[`${r.prefix}${i + 1}`] = bullets[i] || "";
                    }
                }

                resumeUrl = DocumentService.createFromTemplate(resumeFolderId, resumeTitle, templateId, tokens);
            } else {
                const resumeDraftText = `DRAFT RESUME FOR ${company}\n\n[MISSING FACT] - No Template ID Configured.`;
                resumeUrl = DocumentService.createDraftDocument(resumeFolderId, resumeTitle, resumeDraftText);
            }
            SheetsService.appendRow("ARTIFACTS", [opportunityId, "Resume", resumeUrl, new Date()]);

            // --- COVER LETTER ---
            const coverDraftText = `DRAFT COVER LETTER FOR ${company}\n\n[MISSING FACT] - Awaiting LLM connection.`;
            const coverUrl = DocumentService.createDraftDocument(coverFolderId, `${company} - ${role} Cover Letter Draft`, coverDraftText);
            SheetsService.appendRow("ARTIFACTS", [opportunityId, "Cover Letter", coverUrl, new Date()]);

            // --- OUTREACH ---
            const outreachDraftText = `Concise Variant:\nHi... chat about ${role}? \n\nStronger Variant:\nHi... I know X, Y, Z about ${company}.`;
            const outreachUrl = GmailDraftService.createOutreachDraft("", `${company} - Networking: ${role}`, outreachDraftText);
            SheetsService.appendRow("ARTIFACTS", [opportunityId, "Outreach Drafts", outreachUrl, new Date()]);

            LoggerService.logError("Generation", "INFO", `Successfully generated artifacts for ${company}`, "", correlationId);

        } catch (e: any) {
            LoggerService.logError("Generation", "ERROR", `Failed generating artifacts for ${company}`, e.stack, correlationId);
        }
    }

    private static findOrFallback(parent: GoogleAppsScript.Drive.Folder, name: string, fallbackId: string): string {
        const folders = parent.getFoldersByName(name);
        if (folders.hasNext()) {
            return folders.next().getId();
        }
        return fallbackId;
    }
}
