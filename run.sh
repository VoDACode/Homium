#!/usr/bin/env bash

# requre root
if [ $(id -u) != 0 ]; then
  echo "Please run as root"
  exit 1
fi

$INSTALARION_PATH=$1
$SERVER_TARGET=$2

node $INSTALARION_PATH &
node $INSTALARION_PATH/host_client_app.js --target $SERVER_TARGET --port 80 --dist $INSTALARION_PATH/client-app/dist &

echo "Homium is running!"