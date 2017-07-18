FROM nginx:alpine

COPY picker-demo/ /usr/share/nginx/html/picker-demo/
COPY libs/ /usr/share/nginx/html/libs/
RUN chmod -R 777 /usr/share/nginx/html/


#build
#docker build -t pickerdemo:1.0 .

# rebuild
#docker rmi -f pickerdemo:1.0 && docker build -t pickerdemo:1.0 .

# debug run
#docker run -it --rm --net=host --entrypoint=/bin/bash pickerdemo:1.0 

# export image
#docker save pickerdemo:1.0 | gzip -c > pickerdemo.tar.gz

# import image
#gunzip -c pickerdemo.tar.gz | docker load



###################
# setup nginx proxy

# Debug generated config file
#docker run -d -p 80:80 --name nginx-proxy -t nginx

# test live
# sudo docker run --rm -e VIRTUAL_HOST=wmaiz-v-sofa-prod-03.dbc.zdf.de -P -e VIRTUAL_PATH=picker -e VIRTUAL_PATH_TARGET= pickerdemo:1.0

# install live
# sudo docker run -d --name=pickerdemo -e VIRTUAL_HOST=wmaiz-v-sofa-prod-03.dbc.zdf.de -P -e VIRTUAL_PATH=picker -e VIRTUAL_PATH_TARGET= pickerdemo:1.0


# install live static port
# sudo docker run -d --name=pickerdemo -p 4001:80 pickerdemo:1.0
