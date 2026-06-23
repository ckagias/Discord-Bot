#!/bin/bash
set -e

# Slash commands rarely change, so only re-register them when asked (--commands).
# This skips a whole extra container run on every plain code restart.
if [[ "$1" == "--commands" ]]; then
    echo "Registering slash commands..."
    docker compose run --rm bot node src/cmd.js
fi

echo "Rebuilding and restarting bot..."
docker compose up --build -d bot

echo "Bot is running!"
