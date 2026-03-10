const refreshBtn = document.getElementById("refreshBtn");
const ingestForm = document.getElementById("ingestForm");
const ingestResult = document.getElementById("ingestResult");
const kpiGrid = document.getElementById("kpiGrid");
const tasksList = document.getElementById("tasksList");
const reviewList = document.getElementById("reviewList");
const logsList = document.getElementById("logsList");
const settingsStatus = document.getElementById("settingsStatus");
const settingsMissing = document.getElementById("settingsMissing");

function renderKpis(kpis) {
  kpiGrid.innerHTML = "";
  const entries = [
    ["Total Jobs", kpis.jobs_total],
    ["Active Jobs", kpis.jobs_active],
    ["Needs Review", kpis.jobs_needs_review],
    ["Open Tasks", kpis.tasks_open]
  ];
  entries.forEach(([label, value]) => {
    const div = document.createElement("div");
    div.className = "kpi";
    div.innerHTML = `<strong>${value ?? 0}</strong><div class="muted">${label}</div>`;
    kpiGrid.appendChild(div);
  });
}

function renderList(container, items, formatter) {
  container.innerHTML = "";
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="muted">No items.</div>';
    return;
  }
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = formatter(item);
    container.appendChild(div);
  });
}

function refreshDashboard() {
  google.script.run
    .withSuccessHandler((data) => {
      renderKpis(data.kpis || {});
      renderList(tasksList, data.priority_tasks, (task) => {
        return `<strong>${task.task_type || "task"}</strong> · ${task.status || ""}<div class="muted">Due: ${task.due_date || "—"}</div>`;
      });
      renderList(reviewList, data.needs_review, (job) => {
        return `<strong>${job.company || "Unknown company"}</strong> — ${job.role_title || "Role"}<div class="muted">${job.url || ""}</div>`;
      });
      renderList(logsList, data.recent_logs, (log) => {
        return `<strong>${log.level || ""}</strong> ${log.action || ""}<div class="muted">${log.timestamp || ""}</div>`;
      });
    })
    .withFailureHandler((err) => {
      ingestResult.textContent = `Error loading dashboard: ${err.message || err}`;
    })
    .uiGetDashboardData();
}

function refreshSettings() {
  google.script.run
    .withSuccessHandler((data) => {
      settingsMissing.innerHTML = "";
      if (!data.missing || data.missing.length === 0) {
        settingsStatus.textContent = data.ai_key_present ? "Healthy" : "Missing AI key";
      } else {
        settingsStatus.textContent = "Missing settings";
        data.missing.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          settingsMissing.appendChild(li);
        });
      }
    })
    .withFailureHandler((err) => {
      settingsStatus.textContent = "Error";
      settingsMissing.textContent = err.message || err;
    })
    .uiValidateSettings();
}

ingestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  ingestResult.textContent = "Ingesting…";
  const url = document.getElementById("jobUrl").value.trim();
  const text = document.getElementById("jobText").value.trim();
  google.script.run
    .withSuccessHandler((data) => {
      ingestResult.textContent = data.message || "Job ingested.";
      refreshDashboard();
    })
    .withFailureHandler((err) => {
      ingestResult.textContent = err.message || err;
    })
    .uiIngestUrl(url, text);
});

refreshBtn.addEventListener("click", () => {
  refreshDashboard();
  refreshSettings();
});

refreshDashboard();
refreshSettings();
