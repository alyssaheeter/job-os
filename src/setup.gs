function runMeFirst() {
  createMissingSheets();
  installTriggers();
  SpreadsheetApp.getUi().alert("JobOS setup completed.");
}

function createMissingSheets() {
  var ss = SpreadsheetApp.getActive();
  var definitions = [
    { name: "SETTINGS", headers: ["KEY", "VALUE"] },
    { name: "JOBS", headers: [
      "job_id", "url", "company", "role_title", "source", "status", "date_added", "job_description",
      "job_summary_json", "fit_score", "resume_doc_id", "cover_letter_doc_id", "outreach_draft_id",
      "last_contact_date", "next_follow_up_date", "lead_email_message_id", "dedupe_key",
      "ai_resume_used_facts_json", "ai_cover_used_facts_json"
    ] },
    { name: "TASKS", headers: [
      "task_id", "job_id", "task_type", "status", "due_date", "draft_id", "sent_message_id",
      "created_at", "updated_at"
    ] },
    { name: "CONTACTS", headers: [
      "contact_id", "job_id", "name", "email", "role", "notes", "created_at"
    ] },
    { name: "LEADS", headers: [
      "lead_id", "job_id", "email_message_id", "detected_url", "status", "created_at"
    ] },
    { name: "INTERACTIONS", headers: [
      "interaction_id", "ts", "direction", "from", "to", "subject", "thread_id", "message_id",
      "job_id", "type", "confidence", "needs_review", "url_found", "snippet"
    ] },
    { name: "LOGS", headers: [
      "timestamp", "level", "action", "job_id", "task_id", "details_json"
    ] }
  ];

  definitions.forEach(function(def) {
    var sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    ensureHeadersIfEmpty_(sheet, def.headers);
  });

  ensureDefaultSettings_();
}

function ensureDefaultSettings_() {
  var sheet = getSettingsSheet_();
  if (!sheet) return;
  var headerMap = getHeaderMap(sheet);
  if (Object.keys(headerMap).length === 0) return;
  var existing = getSettingsFromSheet_();
  Object.keys(JOBOS_DEFAULT_SETTINGS).forEach(function(key) {
    if (existing[key] === undefined || existing[key] === "") {
      appendRowByMap(sheet, { KEY: key, VALUE: JOBOS_DEFAULT_SETTINGS[key] });
    }
  });
}

function installTriggers() {
  var handlers = ["scanInboxForLeads", "scanInboxForSignals", "reconcileSentMail", "integrityCheck"];
  var existing = ScriptApp.getProjectTriggers();
  existing.forEach(function(trigger) {
    var handler = trigger.getHandlerFunction();
    if (handlers.indexOf(handler) !== -1) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger("scanInboxForLeads").timeBased().everyMinutes(30).create();
  ScriptApp.newTrigger("scanInboxForSignals").timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger("reconcileSentMail").timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger("integrityCheck").timeBased().atHour(2).everyDays(1).create();

  logEvent("INFO", "install_triggers", "", "", { handlers: handlers });
}
