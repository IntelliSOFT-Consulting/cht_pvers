cht --url=https://medic:password.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- sadr
cht --url=https://medic:password.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- aefi
cht --url=https://medic:password.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- pqhpt
cht --url=https://medic:password@localhost --accept-self-signed-certs --upload-custom-translations
docker cp cht_nginx_1:/etc/nginx/private/key.pem .
docker cp cht_nginx_1:/etc/nginx/private/cert.pem .