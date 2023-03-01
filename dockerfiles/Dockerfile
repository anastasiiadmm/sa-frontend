FROM node:16-alpine3.11 as build

ARG REACT_APP_ENVIRONMENT
ARG REACT_APP_API_URL

ENV REACT_APP_ENVIRONMENT=${REACT_APP_ENVIRONMENT:-local}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

WORKDIR /app_build

COPY . /app_build

RUN yarn install

RUN yarn build
RUN yarn global add serve

FROM umputun/nginx-le:latest

WORKDIR /app

COPY --from=build /app_build /app