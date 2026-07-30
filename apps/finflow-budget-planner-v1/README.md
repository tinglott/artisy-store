# FinFlow Budget & Cash-Flow Planner

A downloadable, static, offline-first single-page browser app for recording manually entered income and expenses, setting category budgets, and tracking savings goals. **FinFlow is an organizational tool—not financial, tax, legal, investment, or credit advice.** It does not connect to financial institutions, request bank credentials, use Plaid, or make claims about financial outcomes.

## Files

- `index.html` — page structure, forms, privacy/disclaimer copy, and accessible dialog UI
- `styles.css` — original responsive styles; no third-party CSS, CDN, fonts, or assets
- `app.js` — local-only storage, calculations, CSV/JSON import/export, and interactive behavior
- `SHA256SUMS.txt` — integrity hashes for the three distributable app files

## Included features

- Manual transaction log: date, description, positive amount, type (income/expense), and category
- Search/type filtering, editing, and a dashboard with monthly income, expenses, cash flow, remaining category-budget total, and recent activity
- Default categories plus creation/deletion of unused income or expense categories
- Per-category monthly spending limits and category spending progress
- Savings goals with target and current saved amount, progress, editing, and deletion
- CSV export and strict CSV import. Required headers (in any order): `date,description,amount,category,type`; type is `income` or `expense`; date uses `YYYY-MM-DD`; amount is positive. A template can be downloaded from the Transactions page.
- JSON backup export and validated restore. Restore replaces all FinFlow data only after confirmation.
- Clear-all flow requires typing `CLEAR` before deleting this app’s browser data.
- Privacy/limitations notice, always-visible non-advice disclaimer, responsive mobile layout, keyboard navigation, visible focus states, live status messages, 44px minimum controls, and reduced-motion support.

## Run offline

1. Keep all three app files (`index.html`, `styles.css`, and `app.js`) together in one folder.
2. Double-click `index.html`, or open it from a modern desktop/mobile browser’s file picker.
3. The app works without an internet connection and intentionally has no external URLs, libraries, analytics, API calls, or remote assets.

No installation, web server, login, or account is required. Browser behavior for `file://` pages varies slightly, but current Chrome, Edge, Firefox, and Safari normally allow local storage for locally opened files. If the browser blocks storage for local files, open the folder through a local static-file server or a trusted offline web-app host; do not upload private financial data to a public site merely to use the app.

## Data storage, privacy, and limitations

All FinFlow records are stored only in the current browser profile using `localStorage` key `finflowBudgetPlannerV1`. FinFlow does not transmit data. It cannot access accounts or bank credentials because it has no account connection feature.

`localStorage` is not encrypted, cloud-synced, or durable storage. Data may be lost if browser/site data is cleared, private/incognito browsing ends, the browser/device changes, storage is unavailable, or browser settings remove local data. There is no automatic backup, sync, recovery, multi-user support, or password protection. Export JSON backups regularly, keep them in a secure private location, and test restore before relying on them. CSV is a transaction-only exchange format; JSON is the complete backup format.

The calculations reflect only data manually entered by the user. They do not reconcile with statements, account for pending transactions, taxes, interest, fees, recurring payments, or provide advice or predictions.

## Build manifest and integrity procedure

This is a source-only static product: no compile step, package manager, dependency install, or generated bundle is required. The distributable build consists of the three files listed above. Hashes in `SHA256SUMS.txt` were produced with:

```sh
cd finflow-budget-planner-v1
sha256sum index.html styles.css app.js > SHA256SUMS.txt
sha256sum -c SHA256SUMS.txt
```

On macOS, use `shasum -a 256 index.html styles.css app.js`; on Windows PowerShell, use `Get-FileHash index.html,styles.css,app.js -Algorithm SHA256`. Recreate the manifest after any intentional source change.

## Manual QA checklist

1. Open `index.html` with Wi-Fi disabled; verify the dashboard opens and browser DevTools Network shows no requests.
2. Add an income and expense transaction; confirm dashboard totals and recent transactions update after refreshing the page.
3. Create an expense category, set a monthly budget, and confirm spent/remaining/progress update for the chosen month.
4. Add, edit, and delete a savings goal; confirm its percentage changes correctly.
5. Export CSV, inspect its header/order and values, then import the provided template with changed values. Verify invalid/missing required columns show an error without partial transaction import.
6. Export JSON, clear all data by typing `CLEAR`, restore the JSON file, and verify transactions, categories, budgets, and goals return.
7. Use Tab, Shift+Tab, Enter, and Escape to operate controls/dialogs; check focus visibility and screen-reader status messages.
8. Check a narrow mobile viewport and a reduced-motion browser setting.

## Known boundaries

FinFlow does not automatically categorize or import bank activity, detect duplicate CSV rows, sync across devices, calculate tax, protect data with encryption/passwords, or replace professional financial advice. CSV import makes new matching-type categories when needed, but it rejects the entire file if any row is invalid to avoid a partial transaction import.
