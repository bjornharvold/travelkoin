#!/bin/bash

echo "Releasing new version of SPA..."

cd travelkoin-contracts
npm version minor -m "Bumping minor version of travelkoin-contracts: %s"

echo "Grab the new version number"
CURRENT_VERSION=$(npm run version --silent)

cd ../../travelkoin-admin
npm version minor -m "Bumping minor version of travelkoin-admin: %s"

cd ../../travelkoin-consumer/
npm version minor -m "Bumping minor version of travelkoin-consumer: %s"

cd ..

echo "Committing minor version changes"
git commit -m "Getting ready for another release"

git flow release start $CURRENT_VERSION
git flow release finish $CURRENT_VERSION

git push
git push --tags

echo "Releasing new version of SPA complete"
