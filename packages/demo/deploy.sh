#!/bin/sh

if [ "`git status -s`" ]
then
    echo "The working directory is dirty. Please commit any pending changes."
    exit 1;
fi

echo "Deleting old publication"
rm -rf dist
mkdir dist
git worktree prune
rm -rf .git/worktrees/dist/

echo "Checking out gh-pages branch into dist"
git worktree add -B gh-pages dist origin/gh-pages

echo "Removing existing files"
rm -rf dist/*

echo "Generating site"
parcel build src/index.html --public-url /curves-demo/

echo "Updating gh-pages branch"
cd dist && git add --all && git commit -m "Publishing to gh-pages (publish.sh)"

#echo "Pushing to github"
git push --all