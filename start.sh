#!/bin/bash

if [ "$1" == "up" ]; then
  cd cht-4-app-developer && docker-compose up
else
  echo "Invalid option $1
  
  Help:f

  up            starts the docker containers in production mode 
  "
fi