# GitHub Actions Workflows

This repository uses GitHub Actions to automate the development workflow with branch creation, PR validation, and auto-merge functionality.

## Workflows Overview

### 1. CI - Validate PR (`ci.yml`)
**Triggers:** Pull requests and pushes to `main` branch

**Purpose:** Validates all code changes before merging
- Installs dependencies
- Runs linting checks
- Performs type checking
- Builds the project
- Verifies build output

**Status:** Must pass before PR can be merged

### 2. Auto-Merge PR (`auto-merge.yml`)
**Triggers:** When PRs are opened, updated, or when checks complete

**Purpose:** Automatically merges PRs after validation passes
- Waits for CI validation to complete
- Enables auto-merge on the PR
- Uses squash merge method
- Only works on non-draft PRs

**Requirements:**
- All CI checks must pass
- PR must not be in draft mode

### 3. Create PR from Changes (`create-pr.yml`)
**Triggers:** 
- Manual workflow dispatch (with inputs)
- Push to any branch except `main`

**Purpose:** Helps create pull requests automatically
- Can be triggered manually with custom branch name and PR details
- Automatically creates PRs when pushing to feature branches
- Adds labels and descriptions

## Workflow Process

### Standard Workflow:
1. **Create a branch** (manually or via workflow)
2. **Make changes** and push to the branch
3. **PR is created** automatically (if using feature branch) or manually
4. **CI validates** the changes (linting, type checking, build)
5. **Auto-merge** triggers after validation passes
6. **PR is merged** automatically to `main`

### Manual PR Creation:
1. Go to **Actions** tab in GitHub
2. Select **"Create PR from Changes"** workflow
3. Click **"Run workflow"**
4. Fill in:
   - Branch name
   - PR title
   - PR description (optional)
5. Workflow creates the PR automatically

## Configuration

### Required GitHub Settings:
1. Enable **"Allow auto-merge"** in repository settings
2. Set branch protection rules for `main`:
   - Require status checks to pass
   - Require CI workflow to pass
   - Allow auto-merge

### Branch Protection Setup:
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Select "Validate Code" as required check
   - ✅ Allow auto-merge

## Troubleshooting

### Auto-merge not working?
- Check that branch protection allows auto-merge
- Ensure all required checks pass
- Verify PR is not in draft mode
- Check GitHub Actions logs for errors

### CI failing?
- Run `npm run validate` locally to check issues
- Fix linting errors: `npm run lint`
- Check build output: `npm run build`

### PR not created automatically?
- Ensure you're pushing to a branch other than `main`
- Check workflow permissions in repository settings
- Verify `GITHUB_TOKEN` has necessary permissions

## Local Validation

Before pushing, validate locally:
```bash
npm run validate
```

This runs:
- Linting checks
- Build verification

## Notes

- All workflows use `GITHUB_TOKEN` (automatically provided)
- Auto-merge uses squash merge method
- Feature branches are automatically deleted after merge
- PRs are labeled with "automated" and "needs-review"

