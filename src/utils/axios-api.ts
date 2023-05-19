import axios from 'axios';

import { apiURL2, setupAxiosInterceptors, setupAxiosInterceptorsResponse } from 'utils/config';

const axiosApi2 = axios.create({
  baseURL: apiURL2,
});

setupAxiosInterceptors(axiosApi2);
setupAxiosInterceptorsResponse(axiosApi2);

export { axiosApi2 };
