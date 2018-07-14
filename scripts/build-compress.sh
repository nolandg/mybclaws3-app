cd /home/noland/projects/mybclaws3/mybclaws-app/
PUBLIC_PATH=http://localhost:3002/ yarn run build
cd /home/noland/projects/mybclaws3/mybclaws-app/build/public
find . -type f -not \( -name '*.gz' -or -name '*[~#]' \) -exec sh -c 'gzip -c "{}" > "{}.gz"' \;
cd /home/noland/projects/mybclaws3/mybclaws-app/build/
gnome-terminal -e "http-server -g -p 3002 --cors"
