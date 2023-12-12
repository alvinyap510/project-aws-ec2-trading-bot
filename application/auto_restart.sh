#!/bin/bash
while true; do
    node app.js
    echo "App crashed with exit code $?.  Respawning.." >&2
    sleep 1
done