#!/bin/bash
set -e

echo "Registering slash commands..."
docker compose run --rm bot node src/cmd.js

echo "Rebuilding and restarting bot..."
docker compose up --build -d

echo "Bot is running!"
