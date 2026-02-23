#!/usr/bin/env bash

docker run -it \
	-p 8080:8080 \
	-p 8081:8081 \
	--mount type=bind,src=./,dst=/opt/src \
	myblog
