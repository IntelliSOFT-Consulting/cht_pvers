cht --url=https://dheroot:dhepass.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- sadr
docker cp cht_nginx_1:/etc/nginx/private/key.pem .
docker cp cht_nginx_1:/etc/nginx/private/cert.pem .