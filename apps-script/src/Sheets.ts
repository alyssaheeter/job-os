/**
 * Abstraction for interacting with Google Sheets Tables.
 */
class SheetsService {
    /**
     * Helper to append a row to a specific tab.
     */
    static appendRow(tabName: string, rowData: any[]) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
        if (!sheet) throw new Error(`Tab ${tabName} not found.`);
        sheet.appendRow(rowData);
    }

    /**
     * Upsert a row in the OPPORTUNITIES tab based on a dedupe_key.
     * This provides idempotency.
     */
    static upsertOpportunity(dedupeKey: string, opportunityData: Record<string, any>) {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OPPORTUNITIES");
        if (!sheet) throw new Error("Tab OPPORTUNITIES not found");

        // Headers are in row 1
        const data = sheet.getDataRange().getValues();
        const headers = data[0];
        const dedupeIndex = headers.indexOf("dedupe_key");
        if (dedupeIndex === -1) throw new Error("Missing dedupe_key column in OPPORTUNITIES");

        let rowIndex = -1;
        // Iterate to find existing record
        for (let i = 1; i < data.length; i++) {
            // Match existing record by dedupe key
            if (data[i][dedupeIndex] === dedupeKey) {
                rowIndex = i + 1; // 1-indexed
                break;
            }
        }

        // Construct array aligning column values strictly with headers
        const rowToInsert = headers.map(header => opportunityData[header] || "");

        if (rowIndex !== -1) {
            // Update existing record
            sheet.getRange(rowIndex, 1, 1, rowToInsert.length).setValues([rowToInsert]);
        } else {
            // Cannot find existing record, append new row
            sheet.appendRow(rowToInsert);
        }
    }
}
