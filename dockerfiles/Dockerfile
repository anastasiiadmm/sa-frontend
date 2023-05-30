FROM node:18-alpine3.16 as build
RUN apk add --update python3 make g++\ && rm -rf /var/cache/apk/*

ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_SENTRY_DSN

ENV REACT_APP_ENVIRONMENT=${REACT_APP_ENVIRONMENT:-local}
ENV REACT_APP_SENTRY_DSN=${REACT_APP_SENTRY_DSN}

WORKDIR /app_build

COPY . /app_build

RUN yarn install

RUN yarn build
RUN yarn global add serve

FROM umputun/nginx-le:latest

WORKDIR /app

COPY --from=build /app_build /app
