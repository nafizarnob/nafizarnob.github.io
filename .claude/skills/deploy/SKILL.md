---
name: deploy
description: Deploy the os-portfolio Next.js site to GitHub Pages (nafizarnob.github.io). Use when the user asks to deploy, push, ship, or go live. Stages all changes, commits with a message, and pushes to the main branch which triggers GitHub Pages rebuild.
disable-model-invocation: true
---

# Deploy to GitHub Pages

Runs the full deploy pipeline: build check → stage → commit → push.

## Steps

1. **Verify build** (optional but recommended for content changes):
   ```powershell
   cd "D:\Personal Portfolio\os-portfolio" && npx next build
   ```

2. **Stage all changes**:
   ```powershell
   cd "D:\Personal Portfolio\os-portfolio" && git add -A
   ```

3. **Check what's staged** (show the user):
   ```powershell
   cd "D:\Personal Portfolio\os-portfolio" && git status --short
   ```

4. **Ask for a commit message** if the user didn't provide one. Keep it short and descriptive.

5. **Commit and push**:
   ```powershell
   cd "D:\Personal Portfolio\os-portfolio" && git commit -m "<message>" && git push origin main
   ```

6. Confirm push succeeded and remind the user the site rebuilds at **nafizarnob.github.io** within ~60 seconds.

## Notes

- GitHub Pages deploys from the `main` branch via the `gh-pages` GitHub Actions workflow
- If `git push` fails with auth errors, use `gh repo sync` or re-authenticate with `gh auth login`
- Skip the build step for metadata-only changes (logo swaps, text edits, HTML files in `public/`)
