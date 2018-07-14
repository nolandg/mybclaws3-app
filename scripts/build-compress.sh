cd /home/noland/projects/mybclaws3/mybclaws-app/
yarn run build
cd /home/noland/projects/mybclaws3/mybclaws-app/build/public
find -not -name '*.gz' -type f -exec touch -r {} {}.gz \;
