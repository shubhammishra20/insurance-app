# Insurance Policy App

An Express.js API for uploading and querying insurance policy data (CSV or Excel) in MongoDB—powered by worker threads for scalable processing.

---

## Feature Highlights

- **Upload files** (CSV or XLSX) via `POST /api/upload`
- **Query policies by user name** (case-insensitive): `GET /api/policies?username=...`
- **Retrieve full policy details** with all references: `GET /api/policies/:policyId`
- **View policy counts** grouped by user: `GET /api/aggregate/user-policies`

---

## Quick Start

```bash
git clone <repo-url>
cd insurance-app
npm install
```
