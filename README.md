# CI Demo — Full Walkthrough (Git + GitHub Actions)

This is a minimal but complete project showing how Continuous Integration
actually works end-to-end.

## Project structure

```
ci-demo/
├── .github/
│   └── workflows/
│       └── ci.yml          <- CI workflow definition
├── src/
│   └── calculator.js       <- the code being tested
├── test/
│   └── calculator.test.js  <- the tests
├── package.json
└── README.md
```

## Step 1 — Initialize git locally

```bash
cd ci-demo
git init
git add .
git commit -m "Initial commit: calculator module with tests and CI workflow"
```

## Step 2 — Create a GitHub repository and push

Create an empty repo on github.com (no README/gitignore, since we already
have files), then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/ci-demo.git
git push -u origin main
```

**This push is the trigger.** The moment GitHub receives this push to `main`,
it reads `.github/workflows/ci.yml`, sees the `on: push: branches: [main]`
condition matches, and automatically starts running the workflow — no manual
step required.

## Step 3 — What happens on GitHub's side (automatically)

1. GitHub spins up a fresh Ubuntu virtual machine (the "runner").
2. `actions/checkout@v6` clones your repo onto that VM.
3. `actions/setup-node@v4` installs Node.js 20.
4. `npm install` installs Jest (declared in `package.json`).
5. `npm test` runs Jest, which executes every test in `test/calculator.test.js`.
6. GitHub reports the result: a green ✅ check on the commit if all 4 tests
   pass, or a red ❌ if any fail.

You can watch this happen live in your repo under the **Actions** tab.

## Step 4 — Simulate a contribution (pull request flow)

This is where CI becomes genuinely useful — catching problems *before* code
reaches `main`.

```bash
git checkout -b feature/add-multiply
```

Add a new function to `src/calculator.js`:

```js
function multiply(a, b) {
  return a * b;
}
module.exports = { add, subtract, divide, multiply };
```

Add a matching test to `test/calculator.test.js`:

```js
test("multiplies 3 * 4 to equal 12", () => {
  expect(multiply(3, 4)).toBe(12);
});
```

Commit and push the branch, then open a pull request on GitHub:

```bash
git add .
git commit -m "Add multiply function with test"
git push -u origin feature/add-multiply
```

Because the workflow also triggers `on: pull_request: branches: [main]`,
GitHub runs the same test suite again — this time against the PR branch —
and shows the result directly inside the PR page. If a test fails, the PR
is visibly blocked/flagged before anyone even reviews the code by hand.

## Step 5 — Merge

Once CI passes (green check) and the PR is reviewed/approved, merging into
`main` triggers the `push` version of the workflow one more time, confirming
`main` itself is still healthy after the merge.

## The core idea

You never run `npm test` manually before every push. You write it once,
GitHub Actions runs it automatically on every relevant event, and everyone
touching the repo gets consistent, unbiased feedback — including you.
