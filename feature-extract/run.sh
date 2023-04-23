# join background, note that output is in nohup.out
nohup npm run start &
# check background job
jobs
# bring back job to foreground
fg %number

# start docker container
docker run --cpu-shares 512  -it -d --privileged=true  -v /home/data4T2/huchaoqun:/home/huchaoqun nikolaik/python-nodejs /bin/bash

# start node docker container
docker run  -it -d --privileged=true  -v /home/data4T2/huchaoqun:/home/huchaoqun node /bin/bash

# stop docker
docker stop $id
# enter docker container
docker exec -it $id /bin/bash

# detect single package
node --es-module-specifier-resolution=node out/src/index.js -s $package_path [-c $classifier]

node --es-module-specifier-resolution=node out/src/index.js -b $dir [-c $classifier]
