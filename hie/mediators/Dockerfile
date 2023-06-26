FROM node:alpine
WORKDIR /usr/mediators/


COPY package.json .
RUN npm install typescript yarn -g --force
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3000
CMD ["node", "./build/index.js"]
# CMD ["yarn", "dev"]