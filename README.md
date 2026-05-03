# Bioagent Leaderboard Updater

GitHub Actions updater for a bioinformatics / biomedical AI agent leaderboard gist.

Required repository secrets:

- `GIST_ID`: target gist id.
- `GIST_TOKEN`: GitHub classic token with `gist` scope.

The workflow runs daily at 09:20 Asia/Shanghai, can be run manually, and also runs on pushes to `main`.
