FROM node:latest


ENV NEXT_PUBLIC_API_PORT=8000
RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node ./frontend/ .

USER node

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
