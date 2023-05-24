import { apiUrls, serverUrls, serverUrlsSocket } from 'utils/constants';

const { REACT_APP_ENVIRONMENT } = process.env;

const appEnvironment = REACT_APP_ENVIRONMENT || 'local';

export const apiURL = apiUrls[appEnvironment];
export const socketApiSocket = serverUrlsSocket[appEnvironment];

export const apiUrlCrop = serverUrls[appEnvironment];

