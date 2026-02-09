function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("JobOS")
    .addItem("Run First-Time Setup", "runMeFirst")
    .addSeparator()
    .addItem("Ingest Selected Job", "uiIngestSelected")
    .addItem("Apply to Selected Job", "uiApplySelected")
    .addItem("Archive Selected Job", "uiArchiveSelected")
    .addSeparator()
    .addItem("Draft Outreach (Selected Job)", "uiDraftOutreach")
    .addItem("Draft Follow-up (Selected Task)", "uiDraftFollowup")
    .addSeparator()
    .addItem("Install Triggers", "installTriggers")
    .addToUi();
}
