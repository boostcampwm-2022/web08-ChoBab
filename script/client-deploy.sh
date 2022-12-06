#!/bin/bash
cd client

npm cache clean --force && npm ci
if [ $? -eq 0 ];then
    echo "Client dependencies installed successfully!"
else
    echo "Client dependencies installed failed!"
    exit 100
fi

npm run build
if [ $? -eq 0 ];then
    echo "Client build successfully!"
else
    echo "Client build failed!"
    exit 100
fi
