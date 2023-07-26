#!/usr/bin/env bash

# requre root
if [ $(id -u) != 0 ]; then
  echo "Please run as root"
  exit 1
fi

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
SERVICE_NAME=homium
INSTALARION_PATH=/opt/homium

# install gnupg curl
echo Update and install dependencies...
apt-get update
apt-get install -y gnupg curl openssl unzip wget jq

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
npm install -g typescript

echo Installing MongoDB...

curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
apt update
apt install mongodb-org -y
systemctl start mongod.service
systemctl enable mongod

# Перевірка з'єднання з MongoDB (максимум 10 спроб)
for i in {1..10}; do
    if mongo --eval 'db.runCommand({ connectionStatus: 1 })' | grep -q 'ok.*1'; then
        break
    else
        echo "Waiting for MongoDB to be fully available... (Attempt $i)"
        sleep 2
    fi
done

echo MongoDB installed.
sleep 10s
echo "MongoDB is running!"

# Перевірка з'єднання з MongoDB (максимум 10 спроб)
for i in {1..10}; do
    if mongo --eval 'db.runCommand({ connectionStatus: 1 })' | grep -q 'ok.*1'; then
        break
    else
        echo "Waiting for MongoDB to be fully available... (Attempt $i)"
        sleep 2
    fi
done

echo MongoDB Configuring...

# create mongo admin user
MONGO_ADMIN_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
MONGO_ADMIN_USER=admin

# create mongo user
MONGO_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
MONGO_USER=homium_$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)
MONGO_DATABASE=homium

# create mongo 

mongo << EOF
use admin
db.createUser(
  {
    user: "$MONGO_ADMIN_USER",
    pwd: "$MONGO_ADMIN_PASSWORD",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
EOF

mongo -u $MONGO_ADMIN_USER -p $MONGO_ADMIN_PASSWORD << EOF
use $MONGO_DATABASE
db.createUser(
  {
    user: "$MONGO_USER",
    pwd: "$MONGO_PASSWORD",
    roles: [ { role: "readWrite", db: "$MONGO_DATABASE" }, { role: "dbAdmin", db: "$MONGO_DATABASE" } ]
  }
)
EOF

cat <<EOF > /etc/mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
net:
  port: 27017
  bindIp: 0.0.0.0
security:
  authorization: enabled
EOF

systemctl restart mongod

echo MongoDB configured.

echo MongoDB user: $MONGO_USER@$MONGO_PASSWORD
echo MongoDB admin: $MONGO_ADMIN_USER@$MONGO_ADMIN_PASSWORD

#create mqtt user
MQTT_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
MQTT_USER=homium_$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

echo Installing MQTT...

#install mqtt
apt install mosquitto mosquitto-clients -y

echo MQTT installed.
echo Configuring MQTT...

cat <<EOF > /etc/mosquitto/conf.d/default.conf
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
EOF

touch /etc/mosquitto/passwd
mosquitto_passwd -b /etc/mosquitto/passwd $MQTT_USER $MQTT_PASSWORD

echo Homium user: $MQTT_USER@$MQTT_PASSWORD

systemctl restart mosquitto

echo MQTT configured.

# Download and Install Homium
echo Downloading latest Homium release...

# get last tag
tag_name=$(curl -s https://api.github.com/repos/VoDACode/Homium/releases/latest | grep "tag_name" | grep -o 'v[^"]*')

repository_url=https://codeload.github.com/VoDACode/Homium/legacy.zip/refs/tags/$tag_name

repository_filename=$(curl -sI "$repository_url" | grep -i 'content-disposition' | sed -n 's/.*filename=//p' | sed 's/"//g' | sed 's/\r$//')

repository_folder_name=$(echo $repository_filename | grep -o 'VoDACode-Homium-.*' | sed 's/.zip//' | sed "s/$tag_name-0-g//")

curl -LJO "$repository_url"

# Extract the downloaded zip file

echo 'Script directory: ' $SCRIPT_DIR

echo Extracting Homium...

unzip $repository_filename -d $SCRIPT_DIR
rm -r $repository_filename
echo Homium extracted.

mv $repository_folder_name $INSTALARION_PATH

echo Installing Homium...

cd $INSTALARION_PATH

npm install
npm run copy
echo Homium installed.

# configure Homium

node $INSTALARION_PATH/init.js DB_USER="$MONGO_USER" DB_USER_PASS="$MONGO_PASSWORD" DB_DATABASE="$MONGO_DATABASE" DB_ADMIN_USER="$MONGO_ADMIN_USER" DB_ADMIN_PASS="$MONGO_ADMIN_PASSWORD" MQTT_USER="$MQTT_USER" MQTT_PASS="$MQTT_PASSWORD"

# add to auto run

if [ "$(($(systemctl list-unit-files "$SERVICE_NAME.service" | wc -l)-4))" == 0 ]
    then
        echo "Service is exist!"
        exit 5
fi

echo -n "Creating file '/etc/systemd/system/$SERVICE_NAME.service'..."

echo "[Unit]
Description=Homium backend server.
After=network.target

[Service]
Type=simple
RestartSec=1
User=$USER
WorkingDirectory=$INSTALARION_PATH/
ExecStart=sudo node $INSTALARION_PATH

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/$SERVICE_NAME.service

echo "Done!"
echo -n "Reloading deamon..."
sudo systemctl daemon-reload
echo "Done!"
echo -n "Starting service..."
sudo systemctl start $SERVICE_NAME.service
echo "Done!"
echo "Enabling service..."
sudo systemctl enable $SERVICE_NAME.service
echo "Done!"

echo 'The "'sudo node $INSTALARION_PATH'" command is started and added to autorun.'

# remove temp files
rm -r $INSTALARION_PATH/src/