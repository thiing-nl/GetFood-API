#!/usr/bin/env sh

echo 'Deploying!';
ssh root@api.getfood.io "sh /root/.deploy/update-api.sh"
