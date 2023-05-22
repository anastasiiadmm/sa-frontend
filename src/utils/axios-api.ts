import axios from 'axios';

import { apiURL, setupAxiosInterceptors, setupAxiosInterceptorsResponse } from 'utils/config';

const axiosApi = axios.create({
  baseURL: apiURL,
});

setupAxiosInterceptors(axiosApi);
setupAxiosInterceptorsResponse(axiosApi);

export { axiosApi };
