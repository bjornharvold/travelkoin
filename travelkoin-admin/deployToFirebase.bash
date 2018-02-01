#!/bin/bash

echo "Deploying to https://admin.travelkoin.io"

# Cleaning up first
rm -rf dist node_modules

# Install project
npm install

# Build angular app
ng build --target production --environment prod --aot --build-optimizer

# Deploy
firebase deploy

# Finished
exit 0
