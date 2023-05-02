import axios from 'axios';

import {
  apiURL,
  apiURL2,
  setupAxiosInterceptors,
  setupAxiosInterceptorsResponse,
} from 'utils/config';

const axiosApi = axios.create({
  baseURL: apiURL,
});

const axiosApi2 = axios.create({
  baseURL: apiURL2,
});

setupAxiosInterceptors(axiosApi);
setupAxiosInterceptors(axiosApi2);
setupAxiosInterceptorsResponse(axiosApi);
setupAxiosInterceptorsResponse(axiosApi2);

export { axiosApi, axiosApi2 };
