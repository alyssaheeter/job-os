/**
 * Service to load facts from the FACTS_REPO tab.
 */
class FactsService {
    /**
     * Loads facts allowed for a specific context (e.g. 'resume' or 'coverletter').
     */
    static getAllowedFacts(context: 'resume' | 'coverletter'): any[] {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (!ss) return [];

        const sheet = ss.getSheetByName("FACTS_REPO");
        if (!sheet) return [];

        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const resumeIndex = headers.indexOf("allowed_for_resume");
        const coverLetterIndex = headers.indexOf("allowed_for_coverletter");
        const factIdIndex = headers.indexOf("fact_id");
        const textIndex = headers.indexOf("text");

        if (resumeIndex === -1 || coverLetterIndex === -1 || factIdIndex === -1 || textIndex === -1) {
            throw new Error("FACTS_REPO is missing required columns");
        }

        const facts = [];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const isAllowed = context === 'resume'
                ? row[resumeIndex] === true || String(row[resumeIndex]).toLowerCase() === 'true'
                : row[coverLetterIndex] === true || String(row[coverLetterIndex]).toLowerCase() === 'true';

            if (isAllowed) {
                facts.push({
                    fact_id: String(row[factIdIndex]),
                    text: String(row[textIndex])
                });
            }
        }

        return facts;
    }
}
