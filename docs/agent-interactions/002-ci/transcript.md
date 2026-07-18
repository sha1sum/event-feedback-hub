# GitHub Actions CI workflow
_Exported on 7/18/2026 at 12:27:16 EDT from Cursor (3.12.17)_

---

**User**

Let's add a simple GitHub Actions workflow which will run on pull requests into `main`. It should run CI checks via `yarn ci` in the repository root. It will need to use corepack and run a `yarn install` first.

---

**Cursor**

Node version is `24.18.0` and package manager is `yarn@4.17.1` via corepack. I'll create the workflow using this info.

I created `.github/workflows/ci.yml`. It triggers on pull requests targeting `main`, checks out the repo, sets up Node using the `.node-version` file (`24.18.0`), enables corepack so the pinned `yarn@4.17.1` is used, runs `yarn install --immutable` (fails fast on lockfile drift, appropriate for CI), and then runs `yarn ci`.

