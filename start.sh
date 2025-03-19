#!/bin/bash

# Get the absolute path of the script directory
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

# Start the client
gnome-terminal -- bash -c "cd $BASE_DIR/client && npm run dev; exec bash"

# Start API Gateway
gnome-terminal -- bash -c "cd $BASE_DIR/server/api-gateway && node src/server.js; exec bash"

# Start Metadata Service
gnome-terminal -- bash -c "cd $BASE_DIR/server/metadata-service && node src/server.js; exec bash"

# Start Upload Service
gnome-terminal -- bash -c "cd $BASE_DIR/server/upload-service && node src/server.js; exec bash"
