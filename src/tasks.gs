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

  var body = draft.body + "\n\n" + buildTrackingToken_(jobId, taskId, "outreach");
  var recipient = job.contact_email || "";
  var draftObj = GmailApp.createDraft(recipient || "", draft.subject || "", body, {});

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

  var body = draft.body + "\n\n" + buildTrackingToken_(job.job_id, task.task_id, "followup");
  var recipient = job.contact_email || "";

  var draftId = task.draft_id;
  var updatedDraftId = "";
  if (draftId) {
    var updated = GmailApp.getDraft(draftId).update(recipient || "", draft.subject || "", body, {});
    updatedDraftId = updated.getId();
  } else {
    var created = GmailApp.createDraft(recipient || "", draft.subject || "", body, {});
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
