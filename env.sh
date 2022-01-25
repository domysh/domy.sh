#!/bin/bash

cd `dirname $0`

if [ -f ".env" ]; then
	echo ">> '.env' file already exists!"
	exit
fi

GENERATED_SECRET=`dd if=/dev/random bs=32 count=1 2>/dev/null | od -An -tx1 | tr -d ' \t\n'`
echo "MONGO=mongodb://user:password@172.17.0.1:port/dbname?authSource=dbauth" >> .env
echo "NEXTAUTH_URL=http://external_url/" >> .env
echo "GOOGLE_CLIENT_ID=" >> .env
echo "GOOGLE_CLIENT_SECRET=" >> .env
echo "ADMIN_EMAIL=me@example.com" >> .env
echo "API_SECRET=$GENERATED_SECRET" >> .env
echo "PORT=8080" >> .env
