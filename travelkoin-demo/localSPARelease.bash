#!/bin/bash

echo "Releasing new version of SPA..."

echo "Updating parent."
mvn versions:update-parent -DgenerateBackupPoms=false
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "Something went wrong on line: ${BASH_LINENO[*]}"
    exit 1
fi

echo "Updating all properties."
mvn versions:update-properties -DgenerateBackupPoms=false
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "Something went wrong on line: ${BASH_LINENO[*]}"
    exit 1
fi

echo "Using only the latest Traveliko release versions"
mvn versions:use-latest-versions -Dincludes=com.traveliko* -DgenerateBackupPoms=false
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "Something went wrong on line: ${BASH_LINENO[*]}"
    exit 1
fi

echo "Replacing all SNAPSHOT versions first."
mvn versions:use-releases -DfailIfNotReplaced=true -DgenerateBackupPoms=false
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "Something went wrong on line: ${BASH_LINENO[*]}"
    exit 1
fi

git commit -a -m "Checking all files before releasing..."

echo "Starting release process. It's about to get real!!"
mvn -B gitflow:release-start gitflow:release-finish -DskipTestProject=true
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "Something went wrong on line: ${BASH_LINENO[*]}"
    exit 1
fi

git commit -a -m "Finalizing release on develop branch"
git push origin develop:refs/heads/develop

echo "Committing changes to master branch"
git checkout master
git commit -a -m "Committing changes to master branch"
git push origin master:refs/heads/master

echo "Going back to develop branch"
git checkout develop

echo "Releasing complete"
