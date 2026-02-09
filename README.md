# Job Hunt OS (Google Apps Script + Google Sheets)

Job Hunt OS is a Google Apps Script project bound to a Google Sheet “Dashboard.” This repo supports **two totally separate deployments** (Alyssa and Mom) using one shared codebase and two clasp configurations.

**Non‑negotiables enforced by this repo**
- No shared inbox, no shared Drive, no cross‑account permissions.
- Each deployment is a *separate* Apps Script project bound to that user’s Dashboard Sheet.
- Configuration is stored in each user’s **SETTINGS** tab (key/value pairs).
- Secrets are **never** stored in this repo or in Sheets (API key is stored in Script Properties).

---

## Repository Structure
```
/
  README.md
  LICENSE
  .gitignore
  package.json
  scripts/
    clasp-use.mjs
  clasp/
    .clasp.alyssa.json.example
    .clasp.mom.json.example
  src/
    appsscript.json
    Code.gs
    config.gs
    util.gs
    logging.gs
    menu.gs
    setup.gs
    ui.gs
    jobs.gs
    tasks.gs
    leads.gs
    reconciliation.gs
    docs.gs
    integrity.gs
    ai.gs
```

---

# Setup Track A: Alyssa (Alyssa’s Google account)

> **Important**: You must be signed into Alyssa’s Google account in the browser/terminal where you run `clasp`. Do **not** share the Sheet, Script, or any Drive folders with Mom.

1. **Create Alyssa’s Dashboard Google Sheet**
   - Name it something like `Alyssa - Job Hunt OS Dashboard`.

2. **Create a new Apps Script project bound to that Sheet**
   - In the Sheet: `Extensions → Apps Script`.
   - Name the project `Job Hunt OS - Alyssa`.

3. **Create Alyssa’s Drive folders**
   - **Templates folder** (for resume + cover templates)
   - **Output folder** (for generated artifacts)
   - **Facts folder** (only facts about Alyssa’s background)

4. **Prepare Facts Folder contents (required)**
   Put only factual source material in this folder. Recommended files:
   - `facts_resume_master.docx` or Google Doc (primary facts)
   - `facts_accomplishments.txt`
   - `facts_project_bullets.txt`
   - `facts_roles_history.doc`

   **Naming convention**: prefix with `facts_` for clarity.

5. **Create clasp config for Alyssa**
   ```bash
   npm install
   npm run clasp:use:alyssa
   ```
   This copies `clasp/.clasp.alyssa.json.example` to `.clasp.json`.
   Edit `.clasp.json` and replace:
   - `scriptId`: `[FILL-IN_SCRIPT_ID]` (Alyssa’s Apps Script project ID)
   - `rootDir`: `[FILL-IN_ROOT_DIR]` (usually `src`)

6. **Push code + authorize**
   ```bash
   npm run push
   ```
   Authorize as Alyssa when prompted.

7. **Initialize the sheet**
   - In Alyssa’s Sheet, reload.
   - Use the custom menu **JobOS → Run First‑Time Setup**.

8. **Set Script Properties (API key)**
   - In Apps Script: `Project Settings → Script Properties`.
   - Add key: `AI_API_KEY` with your provider key value.

9. **Populate SETTINGS tab**
   - Run **JobOS → Run First‑Time Setup** if not already.
   - Fill in required keys (see SETTINGS section below).

---

# Setup Track B: Mom (Mom’s Google account)

> **Important**: You must be signed into Mom’s Google account in the browser/terminal where you run `clasp`. Do **not** share the Sheet, Script, or any Drive folders with Alyssa.

1. **Create Mom’s Dashboard Google Sheet**
   - Name it something like `Mom - Job Hunt OS Dashboard`.

2. **Create a new Apps Script project bound to that Sheet**
   - In the Sheet: `Extensions → Apps Script`.
   - Name the project `Job Hunt OS - Mom`.

3. **Create Mom’s Drive folders**
   - **Templates folder** (for resume + cover templates)
   - **Output folder** (for generated artifacts)
   - **Facts folder** (only facts about Mom’s background)

4. **Prepare Facts Folder contents (required)**
   Put only factual source material in this folder. Recommended files:
   - `facts_resume_master.docx` or Google Doc (primary facts)
   - `facts_accomplishments.txt`
   - `facts_project_bullets.txt`
   - `facts_roles_history.doc`

   **Naming convention**: prefix with `facts_` for clarity.

5. **Create clasp config for Mom**
   ```bash
   npm install
   npm run clasp:use:mom
   ```
   This copies `clasp/.clasp.mom.json.example` to `.clasp.json`.
   Edit `.clasp.json` and replace:
   - `scriptId`: `[FILL-IN_SCRIPT_ID]` (Mom’s Apps Script project ID)
   - `rootDir`: `[FILL-IN_ROOT_DIR]` (usually `src`)

6. **Push code + authorize**
   ```bash
   npm run push
   ```
   Authorize as Mom when prompted.

7. **Initialize the sheet**
   - In Mom’s Sheet, reload.
   - Use the custom menu **JobOS → Run First‑Time Setup**.

8. **Set Script Properties (API key)**
   - In Apps Script: `Project Settings → Script Properties`.
   - Add key: `AI_API_KEY` with your provider key value.

9. **Populate SETTINGS tab**
   - Run **JobOS → Run First‑Time Setup** if not already.
   - Fill in required keys (see SETTINGS section below).

---

## SETTINGS tab (required keys)
Minimum required keys (you may add more):
- `TEMPLATES_FOLDER_ID`
- `RESUME_TEMPLATE_ID`
- `COVER_LETTER_TEMPLATE_ID`
- `OUTPUT_FOLDER_ID`
- `FACTS_FOLDER_ID` (required for resume/cover AI)
- `GMAIL_LABEL_PREFIX`
- `ENABLE_AUTO_SEND` (default `false`)
- `FOLLOW_UP_DAYS_1` (default `3`)
- `FOLLOW_UP_DAYS_2` (default `7`)
- `FOLLOW_UP_DAYS_3` (default `14`)
- `SIGNATURE_BLOCK` (default empty)
- `DEFAULT_EMAIL_TONE` (default `professional`)
- `AI_ENABLED` (default `true`)
- `AI_PROVIDER` (default `gemini_api`)
- `AI_MODEL` (default `[FILL-IN]`)
- `FIT_SCORE_ENABLED` (default `false`)
- `FIT_SCORE_THRESHOLD` (default `75`)
- `MAX_OUTPUT_TOKENS` (default `900`)
- `TEMPERATURE` (default `0.3`)

---

## AI usage (high‑leverage only)
AI is used **only** for:
1. Job description summarization
2. Outreach draft generation
3. Follow‑up draft generation
4. Optional fit scoring
5. Resume tailoring
6. Cover letter generation

**No scraping job boards.** Users manually paste job description data if needed.

---

## Important data boundaries
- Resume and cover letter content are generated **only** from facts in `FACTS_FOLDER_ID` + job fields.
- The system does **not** invent credentials, employers, degrees, metrics, dates, tools, or achievements.
- If facts are insufficient, output includes `[FILL-IN]` placeholders and a “Missing Facts Needed” list.

---

## Deploying updates
After making changes:
```bash
npm run push
npm run deploy
```
Replace the deploy description in `package.json` or pass a custom description.

---

## Notes
- This repo supports two clasp configs. Never share `.clasp.json` between users.
- Always log into the correct Google account before running `clasp login`.
- Do **not** share sheets or Drive folders across accounts.
