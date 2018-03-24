#!/bin/sh
BUILD_PATH="../moonly_3003"
rm -rf $BUILD_PATH
mkdir $BUILD_PATH
#source $HOME/.nvm/nvm.sh && . $HOME/.nvm/nvm.sh
#nvm install 8.5.0
#nvm use 8.5.0
rm -rf node_modules
npm install
npm install bcrypt
meteor build --directory $BUILD_PATH
cp settings.json $BUILD_PATH/
cp deployScripts/*.* $BUILD_PATH/
#tar -czf $BUILD_PATH/bundle.tar.gz $BUILD_PATH/bundle
#rm -rf $BUILD_PATH/bundle
