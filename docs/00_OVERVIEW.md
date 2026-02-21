# 00: Overview

Job Hunt OS is an automated, high-leverage job search management system. It lives entirely within a single Google Workspace environment as a bounded Apps Script project attached to a “Dashboard” Google Sheet.

## Core Philosophies

1. **Single Source of Truth (SSOT)**
   The Google Sheet is the master database. Jobs, tasks, outreach, and configuration all live in the spreadsheet, enabling manual override and easy visibility.

2. **Configuration-Driven Design**
   The application behavior—from template folder IDs to AI thresholds—is configured in the `SETTINGS` tab. The code never hardcodes paths or secrets.

3. **Human-in-the-Loop & Safety**
   The system prepares drafts (Gmail, Google Docs) but **never automatically sends outward communication**. You must review every generated Resume, Cover Letter, and Email Draft to ensure precision and accuracy.

4. **Fact-Only Generation**
   The AI utilizes content stored inside a specific Google Drive “Facts Folder”. The system strictly enforces the absence of hallucinated facts. If data is missing for a requirement, it outputs `[MISSING FACT]` for your manual completion.

5. **Idempotency**
   State management uses unique identifier keys (`job_id`, `dedupe_key`) preventing duplicate creation of jobs, tasks, or drafts when a script is re-run or an action box is repeatedly checked.
