#!bin/sh

if ! type "$node" > /dev/null; then
    sudo apt-get install nodejs
fi
if ! type "$ng" > /dev/null; then
    sudo npm install -g @angular/cli
fi

npm install
cd ClientApp
npm install
cd ..