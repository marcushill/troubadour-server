#!/bin/bash
set -x
if [ $TRAVIS_BRANCH == 'master' ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
    # Initialize a new git repo in out, and push it to our server.
    cp package.json out/ # put the package.json in the right place
    cp data/genres.json out/
    cd out/

    git init

    git remote add deploy "ssh://www-user@troubadour.tk/home/www-user/web_apps/troubadour/.git"
    git config user.name "Travis CI"
    git config user.email "marcushill12@gmail.com"

    git add .
    git commit -m "Deploy"
    git push --force deploy master
else
    echo "Not deploying, since this branch isn't master."
fi
