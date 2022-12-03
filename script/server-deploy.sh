#!/bin/bash
cd server

npm cache clean --force && npm ci
if [ $? -eq 0 ];then
    echo "Server dependencies installed successfully!"
else
    echo "Server dependencies installed failed!"
    exit 100
fi

npm run build
if [ $? -eq 0 ];then
    echo "Server build successfully!"
else
    echo "Server build failed!"
    exit 100
fi

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
