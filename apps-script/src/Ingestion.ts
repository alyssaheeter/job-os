/**
 * Handles fetching URL content, checking for bot protection,
 * and routing to the extraction layer.
 */
class IngestionService {
    /**
     * Main entry point when a new valid URL is received.
     */
    static processNewJobUrl(url: string) {
        const correlationId = Utils.generateCorrelationId();
        try {
            // 1. Fetch HTML content
            let htmlContent = "";
            try {
                const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
                if (response.getResponseCode() >= 400) {
                    throw new Error(`HTTP ${response.getResponseCode()}`);
                }
                htmlContent = response.getContentText();
            } catch (e: any) {
                LoggerService.logError("Ingestion", "WARN", `Failed to fetch URL: ${url}. Fallback needed.`, e.stack, correlationId);
                // Implement fallback task creation logic here
                // e.g. Add row to sheet with status "Needs Manual JD Text"
                return;
            }

            // 2. Extract job metadata via AI (Placeholder call)
            const extractedData = ExtractionService.extractJobDetails(htmlContent, correlationId);

            // 3. Generate Dedupe Key
            const dedupeKey = Utils.generateDedupeKey(
                extractedData.company,
                extractedData.role,
                extractedData.location,
                url
            );

            // 4. Calculate Score
            const { score, matchedKeywords } = ScoringService.calculateQualificationScore(extractedData.requirements);

            // 5. Build and Upsert Record
            const opportunityData = {
                opportunity_id: Utils.generateCorrelationId(),
                dedupe_key: dedupeKey,
                company: extractedData.company,
                role: extractedData.role,
                location: extractedData.location,
                posting_url: url,
                status: "New",
                match_score: score,
                matched_keywords: matchedKeywords.join(", ")
            };

            SheetsService.upsertOpportunity(dedupeKey, opportunityData);

            // 6. Scaffold Drive Folders
            const systemFolderId = Config.get("SYSTEM_FOLDER_ID"); // the /JobHunt_OS root folder ID
            if (systemFolderId) {
                DriveScaffoldService.createOpportunityFolders(systemFolderId, opportunityData.company, opportunityData.role);
            }

            // 7. Trigger Document Generation Task (Phase 3)
            // triggerGenerationPipeline(opportunityData.opportunity_id);

        } catch (e: any) {
            LoggerService.logError("Ingestion", "ERROR", `Critical failure processing URL: ${url}`, e.stack, correlationId);
        }
    }

    /**
     * Entry point for manual ingestion via the UI Sidebar (MVP Workflow)
     */
    static processManualJobInput(data: { company: string, role: string, requirements: string, url: string }) {
        const correlationId = Utils.generateCorrelationId();
        try {
            // Split requirements block into tokens
            const reqArray = data.requirements
                .split(/\n-|\n•|\n\*/) // Split on common bullet types
                .map(s => s.trim())
                .filter(s => s.length > 5);

            // If they didn't parse out as bullets, just fake an array of chunks
            const finalReqs = reqArray.length > 0 ? reqArray : [data.requirements];

            // Generate Dedupe Key
            const dedupeKey = Utils.generateDedupeKey(data.company, data.role, "Remote/Unknown", data.url || "manual-entry");

            // Calculate Score
            const { score, matchedKeywords } = ScoringService.calculateQualificationScore(finalReqs);

            const opportunityId = Utils.generateCorrelationId();

            // Build and Upsert Record
            const opportunityData = {
                opportunity_id: opportunityId,
                dedupe_key: dedupeKey,
                company: data.company,
                role: data.role,
                location: "Manual Entry",
                posting_url: data.url || "",
                status: "New",
                match_score: score,
                matched_keywords: matchedKeywords.join(", ")
            };

            SheetsService.upsertOpportunity(dedupeKey, opportunityData);

            // Scaffold Drive Folders
            const systemFolderId = Config.get("SYSTEM_FOLDER_ID");
            let roleFolderId = "";
            if (systemFolderId) {
                const folders = DriveScaffoldService.createOpportunityFolders(systemFolderId, opportunityData.company, opportunityData.role);
                roleFolderId = folders.roleFolderId;
            }

            // Trigger Real Resume Generation
            GenerationService.triggerGenerationPipeline(
                correlationId,
                opportunityId,
                data.company,
                data.role,
                finalReqs,
                roleFolderId
            );

            return { success: true, message: `Processed ${data.company} and generated Document Drafts.` };

        } catch (e: any) {
            LoggerService.logError("Ingestion", "ERROR", `Failed Manual Ingestion for ${data.company}`, e.stack, correlationId);
            throw new Error(`Failed to process job: ${e.message}`);
        }
    }
}
