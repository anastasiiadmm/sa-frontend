import axios, { AxiosRequestHeaders } from 'axios';

import { checkForTokens, logoutUser } from 'redux/auth/authSlice';
import store from 'redux/store';
import { apiURL } from 'utils/config';
import { apiPathV1, apiPathV2 } from 'utils/constants';
import { logoutLocalStorage } from 'utils/token';

const axiosApi = axios.create({
  baseURL: apiURL + apiPathV1,
});

const axiosApiV2 = axios.create({
  baseURL: apiURL + apiPathV2,
});

axiosApiV2.interceptors.request.use(async (config) => {
  const key = store.getState()?.auth?.access;

  if (key) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${key}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

axiosApiV2.interceptors.response.use(
  async (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    const statusCode = error?.response?.status;
    const index = store;
    const { refresh } = index.getState().auth;
    if (
      refresh &&
      statusCode === 401 &&
      error.config &&
      !error.config._isReady &&
      error.response.data.messages
    ) {
      originalRequest._isReady = true;
      try {
        const resp = await axiosApiV2.post('/accounts/refresh/', { refresh });
        if (resp.status === 200) {
          const newTokens = resp.data;
          axiosApiV2.defaults.headers.Authorization = `Bearer ${newTokens.access}`;
          const usersLocal = {
            is_manager: index.getState()?.auth?.is_manager,
            access: resp.data.access,
            refresh,
          };
          index.dispatch(checkForTokens(usersLocal));
          const obj = {
            is_manager: index.getState()?.auth?.is_manager,
            access: resp.data.access,
          };
          localStorage.setItem('users', JSON.stringify(obj));
          window.dispatchEvent(new Event('storage'));
          return axiosApiV2(originalRequest);
        }
      } catch (e) {
        logoutLocalStorage();
        window.location.reload();
      }

      store.dispatch(logoutUser());
    }

    return Promise.reject(error);
  },
);

export { axiosApi, axiosApiV2 };
