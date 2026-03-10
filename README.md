# Job Hunt OS (Google Apps Script + Google Sheets)

Job Hunt OS is a Google Apps Script project bound to a Google Sheet “Dashboard.” This repository provides a single-user system designed for Alyssa to automate and manage a structured job hunt process directly from Google Workspace.

**Non‑negotiables enforced by this repo**
- Single deployment focused purely on Alyssa's job search.
- Configuration is strictly driven via the **SETTINGS** tab (key/value pairs); no hard-coded configuration.
- Secrets are **never** stored in this repo or in Sheets (API keys live in Script Properties).
- Fact-only AI generation ensuring no hallucinations of credentials, metrics, or employers using a dedicated Facts folder.
- Human‑in‑the‑loop: Emails and documents are saved strictly as drafts. No automatic sending.
- Auditability & idempotency: Uses `dedupe_key` and `correlation_id` for runs, enforcing data integrity and robust error logging.

---

## Repository Structure
```
/
  README.md
  LICENSE
  .gitignore
  package.json
  .clasp.json.example       # Example clasp configuration
  apps-script/              # Source code for the backend
    package.json            
    src/                    # Clasp root dir where .gs files and HTML/CSS live
    tests/
  data/
    facts/                  # Example fact structures
  docs/                     # Comprehensive documentation guides (00 to 07)
  prompts/                  # Template prompts for the AI
  schemas/                  # JSON schema definitions for Sheet tabs
  scripts/                  # Helper scripts
  .agent/                   # Antigravity rules and workflows for automation
```

---

## Quick Setup Overview

Please refer to the full setup guide in `/docs/01_SETUP.md` for detailed instructions.

1. **Dashboard Google Sheet**: Create an SSOT Google Sheet.
2. **Apps Script Project**: Create a bound Apps Script project and set up your `.clasp.json`.
3. **Drive folders**: Create a Templates folder, Output folder, and Facts folder (populate with `facts_` files).
4. **Deploy**: Run `npm run push` to upload code, then run the first-time setup menu item in the spreadsheet.

---

## Checkbox Actions Workflow

The **JOBS** sheet supports **checkbox-driven actions** for seamless operation:

- `DO_RESEARCH` → Generates a Decision Brief in the **RESEARCH** sheet.
- `DO_APPLY` → Parses job descriptions, checks against facts, generates tailored resume and cover letter drafts, and creates follow-up tasks.
- `DO_DRAFT_OUTREACH` → Creates an outreach email draft with tracking identifiers.
- `DO_DRAFT_FOLLOWUP` → Creates a follow-up email draft.

Each action is **idempotent**, meaning re-checking a box won't repeat work if the status is already `DONE`. All actions auto-clear upon processing.

---

## Documentation Suite

Dive deeper into the system's capabilities through our detailed documentation suite:

- [docs/00_OVERVIEW.md](docs/00_OVERVIEW.md): Comprehensive system concepts.
- [docs/01_SETUP.md](docs/01_SETUP.md): Step-by-step installation instructions.
- [docs/02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md): Architecture breakdown and diagram.
- [docs/03_INGESTION.md](docs/03_INGESTION.md): Adding jobs via URL, paste, or inbox tracking.
- [docs/04_GENERATION.md](docs/04_GENERATION.md): How fact-only documents and drafts are created.
- [docs/05_WEEKLY_REVIEW.md](docs/05_WEEKLY_REVIEW.md): Running the automated weekly review process.
- [docs/06_TESTING.md](docs/06_TESTING.md): Validating configuration through schemas and tests.
- [docs/07_TROUBLESHOOTING.md](docs/07_TROUBLESHOOTING.md): Resolving common errors and permission issues.

---

## Technical Maintenance

Ensure you run `npm install` to grab all dependencies. Use the provided npm scripts:
- `npm run deploy`: Deploy the Apps Script project via clasp.
- `npm run docs`: Rebuild docs or verify via agent.
- `npm run verify`: Run JSON schema and configuration validation.
- `npm run test`: Validate types and run unit tests.
