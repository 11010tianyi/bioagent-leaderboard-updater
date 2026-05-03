# BioAgent Charts

Static GitHub Pages dashboard and scheduled updater for a bioinformatics / biomedical AI agent leaderboard.

Public site after Pages deployment:

- `https://11010tianyi.github.io/bioagent-leaderboard-updater/`

Published Gist target:

- `https://gist.github.com/11010tianyi/4fc89bce7e5de2f32eb4d4f147c6beef`

## What it does

- Fetches live GitHub stars, forks, issues, and update timestamps.
- Generates English and Chinese Markdown leaderboards for the Gist.
- Generates `latest.json`, `history.json`, and dated snapshots for the dashboard.
- Deploys a static dashboard to GitHub Pages.

## Required repository secrets

- `GIST_ID`: target gist id.
- `GIST_TOKEN`: GitHub token with `gist` scope.

## Local generation

```bash
bun ./bioagent-leaderboard.ts   --output site/bioagent-leaderboard.md   --zh-output site/bioagent-leaderboard.zh-CN.md   --json-output site/data/latest.json   --history-output site/data/history.json   --snapshot-dir site/data/snapshots
```

## Local preview

```bash
cd site
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

The workflow runs daily at 09:20 Asia/Shanghai, can be run manually, and also runs on pushes to `main`.
