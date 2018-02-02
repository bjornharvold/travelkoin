#!/bin/bash

echo "Releasing new version of SPA..."

echo "Disabling git messages for a release"
export GIT_MERGE_AUTOEDIT=no

cd travelkoin-contracts
npm version minor -m "Bumping minor version of travelkoin-contracts: %s"

echo "Grab the new version number"
CURRENT_VERSION=$(npm run version --silent)

cd ../travelkoin-admin
npm version minor -m "Bumping minor version of travelkoin-admin: %s"

cd ../travelkoin-consumer
npm version minor -m "Bumping minor version of travelkoin-consumer: %s"

cd ..

echo "Committing minor version changes"
git commit -a -m "Getting ready for another release"

#git flow release start $CURRENT_VERSION
#git flow release finish -m $CURRENT_VERSION $CURRENT_VERSION

#git push
#git push --tags

#git checkout develop

echo "Enabling git messages for a release again"
export GIT_MERGE_AUTOEDIT=yes

echo "Releasing new version of SPA complete"
