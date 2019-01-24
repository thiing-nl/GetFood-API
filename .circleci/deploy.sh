#!/usr/bin/env sh

echo 'Deploying!';
ssh root@api-v2.getfood.io "sh /root/.deploy/update-api.sh"
