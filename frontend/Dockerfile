FROM node:latest


ENV NEXT_PUBLIC_API_PORT=8000
WORKDIR /var/app
COPY ./package.json /var/app/package.json
RUN yarn install

COPY . /var/app/

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
