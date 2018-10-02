rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Compiled assets for github pages"
git push -u origin master
