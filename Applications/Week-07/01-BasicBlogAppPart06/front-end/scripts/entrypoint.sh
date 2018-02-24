#!/bin/sh
echo "====== Begin entrypoint.sh ======"
npm install -g nodemon@1.7.0
npm install --no-bin-links --no-optional
npm start
#cat /root/.npm/_logs/2018-01-18T00_40_16_380Z-debug.log