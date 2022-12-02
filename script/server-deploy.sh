#!/bin/bash
cd server

npm ci
if [ $? -eq 0 ];then
    echo "Server dependencies installed successfully!"
else
    echo "Server dependencies installation failed!"
    exit 100
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
