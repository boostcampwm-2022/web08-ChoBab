#!/bin/bash
cd server

npm cache verify
npm ci
if [ $? -eq 0 ];then
    echo "Server dependencies installed successfully!"
else
    npm cache clean --force && npm ci
    if [ $? -eq 0 ];then
        echo "Server cache cleaned & dependencies installed successfully!"
    else
        echo "Server dependencies installed failed!"
        exit 100
    fi
fi

npm run build

pm2 reload chobab
if [ $? -eq 0 ];then
    echo "Server deployed successfully!"
else
    pm2 start dist/main.js --name chobab
    if [ $? -eq 0 ];then
        echo "Server deployed successfully!"
    else
        echo "Server deployment failed!"
        exit 100
    fi
fi
