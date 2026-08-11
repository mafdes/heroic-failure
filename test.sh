#!/usr/bin/env sh

set -eu

PORT="${1:-4173}"

echo "Heroic Failure está disponible en: http://127.0.0.1:${PORT}"
echo "Pulsa Ctrl+C para detener el servidor."

exec python3 -m http.server "$PORT" --bind 127.0.0.1
