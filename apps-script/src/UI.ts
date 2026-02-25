/**
 * UI Service to handle Custom Menus and Sidebars in Google Sheets.
 */

/**
 * Creates the "JobOS" custom menu when the spreadsheet opens.
 * This is a special Apps Script reserved function name.
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('JobOS')
        .addItem('Open Ingestion Sidebar', 'showSidebar')
        .addSeparator()
        .addItem('Run First-Time Setup', 'runFirstTimeSetup')
        .addToUi();
}

/**
 * Evaluates and opens the Sidebar HTML.
 */
function showSidebar() {
    const html = HtmlService.createHtmlOutputFromFile('IngestionSidebar')
        .setTitle('Job Hunt OS')
        .setWidth(300);
    SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Called manually or from the menu if testing sheets setup.
 */
function runFirstTimeSetup() {
    SpreadsheetApp.getUi().alert("Please fill in the SETTINGS tab according to the documentation schemas.");
}

/**
 * Endpoint called from Sidebar JavaScript `google.script.run.processManualJob`.
 * Proxies the frontend data into the Ingestion Service to complete the MVP flow.
 */
function processManualJob(formData: { company: string, role: string, requirements: string, url: string }) {
    if (!formData.company || !formData.role || !formData.requirements) {
        throw new Error("Company, Role, and Requirements are required.");
    }

    // Defer processing to the heavy-lifting logic
    return IngestionService.processManualJobInput(formData);
}
