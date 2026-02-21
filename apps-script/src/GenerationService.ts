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
            const resumeFacts = FactsService.getAllowedFacts('resume');
            const coverLetterFacts = FactsService.getAllowedFacts('coverletter');

            // Navigate sub-folders based on scaffolds from DriveScaffoldService
            const parentFolder = DriveApp.getFolderById(roleFolderId);

            // Determine IDs for Draft folders logically by finding them
            let resumeFolderId = this.findOrFallback(parentFolder, "02_Resume_Drafts", roleFolderId);
            let coverFolderId = this.findOrFallback(parentFolder, "03_Cover_Letter_Drafts", roleFolderId);
            let outreachFolderId = this.findOrFallback(parentFolder, "04_Outreach_Drafts", roleFolderId);

            // --- RESUME ---
            // Stub generation: Will be fully connected to LLM when Option is chosen
            const resumeDraftText = `DRAFT RESUME FOR ${company}\n\n[MISSING FACT] - Awaiting LLM connection for fact-only mapping.`;
            const resumeUrl = DocumentService.createDraftDocument(resumeFolderId, `${company} - ${role} Resume Draft`, resumeDraftText);
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
