# ---- Base image - order important ----
FROM hmctspublic.azurecr.io/ccd/definition-processor:latest as base

# ----        Runtime image         ----
FROM hmctspublic.azurecr.io/ccd/definition-importer:latest as runtime
RUN apk add --no-cache curl jq zip unzip git
COPY --from=base . .
COPY ./benefit/data /data
COPY ./benefit/data/ccd-template.xlsx /opt/ccd-definition-processor/data
WORKDIR /opt/app
COPY package.json yarn.lock .yarnrc.yml .
ADD .yarn .yarn
RUN pwd && ls -la
COPY /benefit /
ADD ./config "/config"
RUN yarn install && yarn cache clean
COPY index.js ./
ENV NODE_CONFIG_DIR="/config"
CMD ["yarn", "start"]
EXPOSE 3000
