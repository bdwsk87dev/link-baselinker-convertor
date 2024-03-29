#!/bin/sh

cd /var/www/html
php artisan config:cache
php artisan route:clear
php artisan wait-db-alive
php artisan migrate

exec "$@"
