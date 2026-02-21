/**
 * Simple Logger for writing errors to the ERROR_LOG sheet tab.
 * Helps monitor ingestion and AI generation errors systematically.
 */
class LoggerService {
    static logError(component: string, severity: 'INFO' | 'WARN' | 'ERROR', message: string, stacktrace?: string, correlation_id?: string) {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (!ss) return;

        const sheet = ss.getSheetByName("ERROR_LOG");
        if (!sheet) return;

        // Schema: timestamp, component, severity, message, stacktrace, correlation_id
        try {
            sheet.appendRow([
                new Date(),
                component,
                severity,
                message,
                stacktrace || "",
                correlation_id || ""
            ]);
        } catch (e) {
            console.error("Failed to write to ERROR_LOG", e);
        }
    }
}
