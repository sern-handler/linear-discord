#!/bin/bash
git pull

docker build . -t srizan10/sernlinear

docker stop vinci

docker rm vinci

docker run -d -t --name sern-linear --restart unless-stopped srizan10/sernlinear