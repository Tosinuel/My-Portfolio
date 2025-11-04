# Portfolio site — Emmanuel Oluwatosin

Minimal instructions to run and deploy the site.

Prerequisites
- Node.js and npm

Install and run locally (PowerShell)

```powershell
cd "Projects\portfolio-site"
npm install
npm run extract   # optional: converts Word docs from parent Projects folder into content/*.txt
npm run start     # serves site with live-server
```

Deploy to GitHub
- Initialize a git repo in `Projects/portfolio-site`, add a remote (your GitHub repo URL), then push:

```powershell
cd "Projects\portfolio-site"
git init
git add .
git commit -m "Initial: portfolio site"
git remote add origin <your-github-repo-url>
git push -u origin main
```

If you want GitHub Pages, enable Pages in the repository settings or push to the `gh-pages` branch and configure Pages accordingly.

Notes
- Place generated or custom `.txt` files into `content/` so each project button loads the actual project text.
- Accessibility: semantic HTML, ARIA states, keyboard focus styles included.

If you want, I can initialize the local git repo and make the initial commit here, but I need the remote GitHub repository URL (or permission to create one) to push and publish. Tell me how you want to proceed.
