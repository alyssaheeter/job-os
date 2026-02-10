function uiIngestUrl(url, optionalText) {
  return ingestJobFromUrl_(url, optionalText, "sidebar");
}

function ingestJobFromUrl_(url, optionalText, source) {
  var normalizedUrl = normalizeJobUrl_(url);
  if (!normalizedUrl) {
    throw new Error("Valid URL is required.");
  }
  var jobsSheet = getSheetOrThrow_("JOBS");
  var existingRow = findJobRowByDedupeKey_(jobsSheet, normalizedUrl);
  if (existingRow !== -1) {
    var existing = readRowByMap(jobsSheet, existingRow);
    var updates = {};
    if (!existing.normalized_url) {
      updates.normalized_url = normalizedUrl;
    }
    if (!existing.dedupe_key) {
      updates.dedupe_key = buildUrlDedupeKey_(normalizedUrl);
    }
    if (Object.keys(updates).length) {
      updateRowByMap(jobsSheet, existingRow, updates);
    }
    return {
      job_id: existing.job_id,
      company: existing.company || "",
      role: existing.role_title || "",
      needs_review: !!existing.needs_review,
      message: "Job already exists."
    };
  }

  var fetchResult = fetchJobUrl_(normalizedUrl);
  var contentForAi = fetchResult.body || "";
  var optionalTextClean = coerceString_(optionalText || "").trim();

  var aiResult = aiExtractJobFromUrl(normalizedUrl, contentForAi, optionalTextClean);
  var needsReview = !!aiResult.needs_review;
  if (!optionalTextClean && fetchResult.thin) {
    needsReview = true;
  }

  var jobId = generateId_("job");
  var jobDescription = aiResult.job_description || optionalTextClean || "";
  if (!jobDescription && contentForAi) {
    jobDescription = stripHtml_(contentForAi);
  }

  var jobRecord = {
    job_id: jobId,
    raw_url: url,
    normalized_url: normalizedUrl,
    url: normalizedUrl,
    fetch_status: fetchResult.status,
    status: "new",
    date_added: formatDate_(new Date()),
    dedupe_key: buildUrlDedupeKey_(normalizedUrl),
    company: aiResult.company || "",
    role_title: aiResult.role_title || "",
    source: source || aiResult.source || "url",
    job_description: jobDescription,
    needs_review: needsReview
  };

  appendRowByMap(jobsSheet, jobRecord);
  logEvent("INFO", "job_ingested_url", jobId, "", {
    url: normalizedUrl,
    status: fetchResult.status,
    needs_review: needsReview
  });

  return {
    job_id: jobId,
    company: jobRecord.company,
    role: jobRecord.role_title,
    needs_review: needsReview,
    message: needsReview ? "Job ingested, needs review." : "Job ingested."
  };
}

function fetchJobUrl_(url) {
  var result = { status: "error", body: "", thin: true };
  try {
    var response = UrlFetchApp.fetch(url, {
      method: "get",
      followRedirects: true,
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobOS/1.0)",
        "Accept-Language": "en-US,en;q=0.9"
      },
      timeout: 15000
    });
    var code = response.getResponseCode();
    var text = response.getContentText() || "";
    var thin = text.length < 1200 || /access denied|forbidden|enable javascript/i.test(text);
    result.status = String(code);
    result.body = text;
    result.thin = thin;
  } catch (err) {
    logEvent("WARN", "url_fetch_error", "", "", { url: url, error: String(err) });
  }
  return result;
}

function stripHtml_(html) {
  var text = String(html || "").replace(/<script[\s\S]*?<\/script>/gi, " ");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  if (text.length > 20000) {
    text = text.substring(0, 20000);
  }
  return text;
}
