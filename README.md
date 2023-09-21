## INSTALLATION

Please make sure the release file is unpacked under a Web-accessible
directory. You shall see the following files and directories:

        dockerfiles/
        public/
        src/
        README
        package.json
        tsconfig.json
        webpack.config.js

## REQUIREMENTS

Platform: cross-platform solution, linux, windows, macOS, other.

Programming language used React JS / TypeScript

The service uses the following technologies:

        node -v version 18.13.0 and yarn
        nvm current version 0.39.1

## BASE DEPENDENCIES

        typescript
        axios for networking.
        redux for state management.
        redux-thunk to dispatch asynchronous actions.
        react-router fully-featured routing library for the React JavaScript library
        react-router-dom fully-featured routing library for the React JavaScript library
        antDesign & scss & sass for component styling
        react-input-mask
        react-leaflet
        highcharts
        sentry to help developers write better software faster.
        moment for encoding dates

## QUICK START

        clone SA project from gitlab repository https://gitlab.com/smarttractor/sa-frontend.git
        cd frontend

Set usage requirements endpoints into .env file:

        REACT_APP_ENVIRONMENT=''

Next:

        RUN yarn/npm install
        RUN yarn/npm start

## UPDATE RESULTS

V1.0.0 version, 27-06-2023
