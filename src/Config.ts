/**
 * Configuration module that reads from the SETTINGS tab.
 */
class Config {
  /**
   * Fetch a setting value by key.
   * Note: A caching layer could be added here to minimize Sheets API calls.
   */
  static get(key: string): string | null {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return null; // Used when running in detached mode

    const sheet = ss.getSheetByName("SETTINGS");
    if (!sheet) return null;

    const data = sheet.getDataRange().getValues();
    // Assuming row 1 is headers (Key, Value)
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        return String(data[i][1]);
      }
    }
    return null;
  }
}
