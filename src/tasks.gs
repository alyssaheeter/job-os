function createOutreachDraftForJob(jobId) {
  var jobSheet = getSheetOrThrow_("JOBS");
  var jobRow = findRowById_(jobSheet, "job_id", jobId);
  if (jobRow === -1) {
    throw new Error("Job not found: " + jobId);
  }
  var job = readRowByMap(jobSheet, jobRow);

  var taskId = generateId_("task");
  var task = {
    task_id: taskId,
    job_id: jobId,
    task_type: "outreach",
    status: "draft",
    due_date: formatDate_(new Date()),
    created_at: new Date(),
    updated_at: new Date()
  };
  appendRowByMap(getSheetOrThrow_("TASKS"), task);

  var draft = aiDraftOutreach({
    company: job.company,
    role_title: job.role_title,
    url: job.url,
    job_description: job.job_description,
    signature: getSignatureBlock_(),
    tone: getSetting("DEFAULT_EMAIL_TONE")
  });

  var body = draft.body + "\n\n";
  var htmlBody = draft.body + "<br><br>" + buildTrackingTokenHtmlComment_(jobId, taskId, "outreach");
  var recipient = job.contact_email || "";
  var draftObj = GmailApp.createDraft(recipient || "", draft.subject || "", body, { htmlBody: htmlBody });

  updateTaskDraft_(taskId, draftObj.getId());
  logEvent("INFO", "draft_outreach", jobId, taskId, { draftId: draftObj.getId() });
  return draftObj.getId();
}

function createFollowupDraftForTask(taskId) {
  var taskSheet = getSheetOrThrow_("TASKS");
  var taskRow = findRowById_(taskSheet, "task_id", taskId);
  if (taskRow === -1) {
    throw new Error("Task not found: " + taskId);
  }
  var task = readRowByMap(taskSheet, taskRow);
  var jobSheet = getSheetOrThrow_("JOBS");
  var jobRow = findRowById_(jobSheet, "job_id", task.job_id);
  if (jobRow === -1) {
    throw new Error("Job not found for task: " + task.job_id);
  }
  var job = readRowByMap(jobSheet, jobRow);

  var draft = aiDraftFollowup({
    company: job.company,
    role_title: job.role_title,
    url: job.url,
    job_description: job.job_description,
    signature: getSignatureBlock_(),
    tone: getSetting("DEFAULT_EMAIL_TONE")
  });

  var body = draft.body + "\n\n";
  var htmlBody = draft.body + "<br><br>" + buildTrackingTokenHtmlComment_(job.job_id, task.task_id, "followup");
  var recipient = job.contact_email || "";

  var draftId = task.draft_id;
  var updatedDraftId = "";
  if (draftId) {
    var updated = GmailApp.getDraft(draftId).update(recipient || "", draft.subject || "", body, { htmlBody: htmlBody });
    updatedDraftId = updated.getId();
  } else {
    var created = GmailApp.createDraft(recipient || "", draft.subject || "", body, { htmlBody: htmlBody });
    updatedDraftId = created.getId();
  }

  updateRowByMap(taskSheet, taskRow, { draft_id: updatedDraftId, updated_at: new Date() });
  logEvent("INFO", "draft_followup", job.job_id, task.task_id, { draftId: updatedDraftId });
  return updatedDraftId;
}

function updateTaskDraft_(taskId, draftId) {
  var taskSheet = getSheetOrThrow_("TASKS");
  var taskRow = findRowById_(taskSheet, "task_id", taskId);
  if (taskRow === -1) return;
  updateRowByMap(taskSheet, taskRow, { draft_id: draftId, updated_at: new Date() });
}

function buildTrackingToken_(jobId, taskId, action) {
  var token = "[[JOBOS job_id=" + jobId + "";
  if (taskId) {
    token += " task_id=" + taskId;
  }
  token += " action=" + action + "]]";
  return token;
}

function buildTrackingTokenHtmlComment_(jobId, taskId, action) {
  return "<!-- " + buildTrackingToken_(jobId, taskId, action) + " -->";
}

function ensureFollowupTaskForJob_(jobId) {
  var taskSheet = getSheetOrThrow_("TASKS");
  var taskRow = findLatestTaskRowForJob_(taskSheet, jobId, "followup");
  if (taskRow !== -1) {
    return readRowByMap(taskSheet, taskRow).task_id;
  }
  var dueDate = formatDate_(new Date(new Date().getTime() + getNumberSetting("FOLLOW_UP_DAYS_1", 3) * 24 * 60 * 60 * 1000));
  return createTaskForJob_(taskSheet, jobId, "followup", "new", dueDate);
}

function getOrCreateFollowupTaskForJob_(jobId) {
  var taskSheet = getSheetOrThrow_("TASKS");
  var taskRow = findLatestTaskRowForJob_(taskSheet, jobId, "followup");
  if (taskRow !== -1) {
    var existing = readRowByMap(taskSheet, taskRow);
    if (String(existing.status || "").toLowerCase() !== "done") {
      return existing.task_id;
    }
  }
  return createTaskForJob_(taskSheet, jobId, "followup", "draft", formatDate_(new Date()));
}

function createTaskForJob_(taskSheet, jobId, taskType, status, dueDate) {
  var taskId = generateId_("task");
  appendRowByMap(taskSheet, {
    task_id: taskId,
    job_id: jobId,
    task_type: taskType,
    status: status,
    due_date: dueDate || "",
    created_at: new Date(),
    updated_at: new Date()
  });
  return taskId;
}

function findLatestTaskRowForJob_(taskSheet, jobId, taskType) {
  var lastRow = taskSheet.getLastRow();
  if (lastRow < 2) {
    return -1;
  }
  var headerMap = getHeaderMap(taskSheet);
  var data = taskSheet.getRange(2, 1, lastRow - 1, taskSheet.getLastColumn()).getValues();
  for (var i = data.length - 1; i >= 0; i--) {
    if (String(data[i][headerMap.job_id - 1]) === String(jobId) &&
        String(data[i][headerMap.task_type - 1]) === String(taskType)) {
      return i + 2;
    }
  }
  return -1;
}
