cht --url=https://african:hatua.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- sadr
cht --url=https://african:hatua.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- aefi
cht --url=https://african:hatua.@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- pqhpt
cht --url=https://african:hatua@localhost --accept-self-signed-certs --upload-custom-translations
cht --url=https://african:hatua@localhost --accept-self-signed-certs  compile-app-settings upload-app-settings
cht --url=https://african:hatua.@localhost --accept-self-signed-certs csv-to-docs upload-docs
docker cp cht_nginx_1:/etc/nginx/private/key.pem .
docker cp cht_nginx_1:/etc/nginx/private/cert.pem .

docker run -d --rm --name temp -v app-devl_cht-ssl:/etc/nginx/private/ alpine tail -f /dev/null


CHT_COMPOSE_PROJECT_NAME=app-devl COUCHDB_SECRET=foo DOCKER_CONFIG_PATH=${PWD} COUCHDB_DATA=${PWD}/couchd CHT_COMPOSE_PATH=${PWD} COUCHDB_USER=dheroot COUCHDB_PASSWORD=dhepass. docker-compose up