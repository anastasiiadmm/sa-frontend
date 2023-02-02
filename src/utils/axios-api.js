import axios from 'axios';

import { apiURL } from 'utils/config';

const axiosApi = axios.create({
  baseURL: apiURL,
});

export default axiosApi;
