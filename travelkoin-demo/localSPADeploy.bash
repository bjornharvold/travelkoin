#!/bin/bash

echo "Deploying Single Page Application"

if [ -z ${1+x} ]; then
    echo "Git branch unset"
    exit
else
    echo "git branch is set to '$1'"
fi

if [ -z ${2+x} ]; then
    echo "Environment unset"
    exit
else
    echo "Environment is set to '$2'"
fi

gitBranch=$1

git checkout $gitBranch

environment=$2

ng build --target=production --environment=$environment

mvn -B deploy -Dmaven.test.skip=true
STATUS=$?
if [ $STATUS -ne 0 ]; then
    echo "Something went wrong on line: ${BASH_LINENO[*]}"
    git checkout develop
    exit 1
fi

git checkout develop
