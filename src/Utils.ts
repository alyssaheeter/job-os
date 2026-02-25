/**
 * Utility functions for Job Hunt OS
 */
class Utils {
    /**
     * Generates a unique dedupe key using SHA-1 based on key job identifiers.
     */
    static generateDedupeKey(company: string, role: string, location: string, url: string): string {
        const rawString = `${company}|${role}|${location}|${url}`.toLowerCase();

        // Hash function provided by Apps Script
        const signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, rawString);
        let hash = '';
        for (let i = 0; i < signature.length; i++) {
            let byte = signature[i];
            if (byte < 0) byte += 256;
            let hex = byte.toString(16);
            if (hex.length === 1) hex = '0' + hex;
            hash += hex;
        }
        return hash;
    }

    /**
     * Generates a random UUID / correlation ID for log tracking.
     */
    static generateCorrelationId(): string {
        return Utilities.getUuid();
    }
}
