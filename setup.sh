#!/bin/bash

if [ "$1" == "up" ]; then
  # start up docker containers
  CHT_COMPOSE_PROJECT_NAME=app-devl COUCHDB_SECRET=foo DOCKER_CONFIG_PATH=${PWD} COUCHDB_DATA=${PWD}/couchd CHT_COMPOSE_PATH=${PWD} COUCHDB_USER=medic COUCHDB_PASSWORD=password docker compose -p cht_pvers_hie -f ./hie/docker-compose.cht-core.yml -f ./hie/docker-compose.cht-couchdb.yml -f ./hie/docker-compose.yml up -d --build
elif [ "$1" == "dev" ]; then
  # start up docker containers 
  CHT_COMPOSE_PROJECT_NAME=app-devl COUCHDB_SECRET=foo DOCKER_CONFIG_PATH=${PWD} COUCHDB_DATA=${PWD}/couchd CHT_COMPOSE_PATH=${PWD} COUCHDB_USER=medic COUCHDB_PASSWORD=password docker compose -p cht_pvers_hie -f ./hie/docker-compose.cht-core.yml -f ./hie/docker-compose.cht-couchdb.yml -f ./hie/docker-compose-dev.yml up -d --build --force-recreate
elif [ "$1" == "publish" ]; then
  cd cht_app && cht --url=https://medic:password@localhost --accept-self-signed-certs compile-app-settings upload-app-settings && cht --url=https://medic:password@localhost --accept-self-signed-certs
elif [ "$1" == "down" ]; then
  docker compose -p cht_pvers_hie -f ./hie/docker-compose.yml -f ./hie/docker-compose-dev.yml -f ./hie/docker-compose.cht-core.yml -f ./hie/docker-compose.cht-couchdb.yml down
elif [ "$1" == "setup-creds" ]; then
  curl -X PUT -H "Content-Type: text/plain" https://medic:password@localhost/api/v1/credentials/openhim -d 'password' --insecure
elif [ "$1" == "logs" ]; then
  docker compose -p cht_pvers_hie -f ./hie/docker-compose.yml -f ./hie/docker-compose-dev.yml -f ./hie/docker-compose.cht-core.yml -f ./hie/docker-compose.cht-couchdb.yml logs $2 -f
else
  echo "Invalid option $1
  
  Help:

  up            starts the docker containers in production mode
  dev           starts the docker containers in development mode
  publish       packages and publish the CHT app to CHT Instance.
  down          stop all services
  setup-creds   create OpenHIM credentials on CHT Instance.
  logs          view mediator logs (append service name to specify service)
  "
fi