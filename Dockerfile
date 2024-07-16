FROM chainguard/node:latest-dev

WORKDIR /app

COPY --chown=node:node package.json package-lock.json *.html *.js* *.ts /app/
COPY --chown=node:node src /app/src
COPY --chown=node:node server /app/server

RUN ls -l \
    && npm install \
    && npm ci

ENV NODE_ENV=production

RUN ls -l \
    && npm run build --if-present \
    && cd /app/server \
    && npm ci \
    && cd .. \
    && ls -l

FROM chainguard/node:latest
COPY --from=0 /app/server /app
COPY --from=0 /app/dist /app/dist

EXPOSE 5173

CMD [ "server.js" ]