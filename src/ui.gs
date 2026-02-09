function uiIngestSelected() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== "JOBS") {
    SpreadsheetApp.getUi().alert("Please select a row in the JOBS sheet.");
    return;
  }
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a data row.");
    return;
  }
  try {
    ingestJobFromRow_(row);
    SpreadsheetApp.getUi().alert("Job ingested.");
  } catch (err) {
    logEvent("ERROR", "ui_ingest", "", "", { error: String(err) });
    SpreadsheetApp.getUi().alert("Error: " + err.message);
  }
}

function uiApplySelected() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== "JOBS") {
    SpreadsheetApp.getUi().alert("Please select a row in the JOBS sheet.");
    return;
  }
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a data row.");
    return;
  }
  try {
    var job = readRowByMap(sheet, row);
    if (!job.job_id) {
      SpreadsheetApp.getUi().alert("Missing job_id. Ingest the job first.");
      return;
    }
    applyJob(job.job_id);
    SpreadsheetApp.getUi().alert("Artifacts created.");
  } catch (err) {
    logEvent("ERROR", "ui_apply", "", "", { error: String(err) });
    SpreadsheetApp.getUi().alert("Error: " + err.message);
  }
}

function uiArchiveSelected() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== "JOBS") {
    SpreadsheetApp.getUi().alert("Please select a row in the JOBS sheet.");
    return;
  }
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a data row.");
    return;
  }
  try {
    updateRowByMap(sheet, row, { status: "archived" });
    SpreadsheetApp.getUi().alert("Job archived.");
  } catch (err) {
    logEvent("ERROR", "ui_archive", "", "", { error: String(err) });
    SpreadsheetApp.getUi().alert("Error: " + err.message);
  }
}

function uiDraftOutreach() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== "JOBS") {
    SpreadsheetApp.getUi().alert("Please select a row in the JOBS sheet.");
    return;
  }
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a data row.");
    return;
  }
  try {
    var job = readRowByMap(sheet, row);
    if (!job.job_id) {
      SpreadsheetApp.getUi().alert("Missing job_id. Ingest the job first.");
      return;
    }
    var draftId = createOutreachDraftForJob(job.job_id);
    updateRowByMap(sheet, row, { outreach_draft_id: draftId });
    SpreadsheetApp.getUi().alert("Outreach draft created.");
  } catch (err) {
    logEvent("ERROR", "ui_draft_outreach", "", "", { error: String(err) });
    SpreadsheetApp.getUi().alert("Error: " + err.message);
  }
}

function uiDraftFollowup() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== "TASKS") {
    SpreadsheetApp.getUi().alert("Please select a row in the TASKS sheet.");
    return;
  }
  var row = sheet.getActiveRange().getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert("Please select a data row.");
    return;
  }
  try {
    var task = readRowByMap(sheet, row);
    if (!task.task_id) {
      SpreadsheetApp.getUi().alert("Missing task_id.");
      return;
    }
    var draftId = createFollowupDraftForTask(task.task_id);
    updateRowByMap(sheet, row, { draft_id: draftId, updated_at: new Date() });
    SpreadsheetApp.getUi().alert("Follow-up draft created.");
  } catch (err) {
    logEvent("ERROR", "ui_draft_followup", "", "", { error: String(err) });
    SpreadsheetApp.getUi().alert("Error: " + err.message);
  }
}
