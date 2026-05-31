#!/bin/bash
# Wrapper that the weekly scheduler calls. Logs each run to backups/backup.log
# so you can confirm it's running. Uses the absolute node path because the
# scheduler runs with a minimal environment.
cd "$(dirname "$0")/.." || exit 1
NODE="/Users/jishagoyal/.nvm/versions/node/v20.20.0/bin/node"
echo "===== backup run: $(date) =====" >> backups/backup.log 2>&1
"$NODE" scripts/backup.mjs >> backups/backup.log 2>&1
echo "" >> backups/backup.log 2>&1
