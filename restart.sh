#!/bin/bash
set -e

usage() {
    echo "Usage: ./restart.sh [--commands] [--bot] [--dashboard]"
    echo ""
    echo "  (no flag)     Re-register slash commands and rebuild bot + dashboard"
    echo "  --commands    Re-register slash commands only (no image rebuild)"
    echo "  --bot         Rebuild and restart the bot container only"
    echo "  --dashboard   Rebuild and restart the dashboard container only"
}

case "$1" in
    --commands)
        echo "Registering slash commands..."
        docker compose run --rm bot node src/cmd.js
        echo "Done!"
        ;;
    --bot)
        echo "Rebuilding and restarting bot..."
        docker compose up --build -d bot
        echo "Bot is running!"
        ;;
    --dashboard)
        echo "Rebuilding and restarting dashboard..."
        docker compose up --build -d dashboard
        echo "Dashboard is running!"
        ;;
    "")
        echo "Registering slash commands..."
        docker compose run --rm bot node src/cmd.js
        echo "Rebuilding and restarting bot + dashboard..."
        docker compose up --build -d bot dashboard
        echo "All services are running!"
        ;;
    --help)
        usage
        ;;
    *)
        echo "Unknown flag: $1"
        echo ""
        usage
        exit 1
        ;;
esac
