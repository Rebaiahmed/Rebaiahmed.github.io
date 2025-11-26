# 🧠 Ahmed Rebai – Developer Portfolio

A personal developer portfolio built with **Vue 3**, **Vite**, and **TailwindCSS** styled like a Linux/Docker terminal.

## 🔥 Features

- 🖥️ Clean CLI-style UI
- 🌗 Dark/Light theme toggle
- ⚙️ Vue Router navigation
- 🧪 Skills, Projects, Experience, Certifications, and Blogs
- 🔍 Tag filtering and searchable blog/project list
- 🚀 Deployed via GitHub Pages
- 🐧 Terminal-style command prompts (e.g., `ls skills`, `pwd frontend`)
- 💌 Contact form with validation feedback

## 📦 Setup

```bash
npm install
npm run dev
```

## 🚀 GitHub Actions Workflows

This repository includes automated CI/CD workflows:

### Automated PR Workflow
- **Branch Creation**: Create feature branches for each change
- **PR Validation**: Automatic linting, type checking, and build verification
- **Auto-Merge**: PRs are automatically merged after validation passes

### Workflows:
1. **CI Validation** - Runs on every PR and push to main
2. **Auto-Merge** - Merges PRs after CI passes
3. **Create PR** - Helper workflow to create PRs automatically

See [`.github/workflows/README.md`](.github/workflows/README.md) for detailed documentation.

### Quick Start with Workflows:
1. Create a feature branch: `git checkout -b feature/your-change`
2. Make your changes and commit
3. Push to GitHub: `git push origin feature/your-change`
4. PR is created automatically and validated
5. PR auto-merges after validation passes ✓

### Local Validation:
```bash
npm run validate  # Run linting and build checks
npm run lint      # Fix linting issues
npm run build     # Verify build works
```
