import axios, { AxiosRequestHeaders } from 'axios';

import { checkForTokens, logoutUser } from 'redux/auth/authSlice';
import store from 'redux/store';
import { apiURL } from 'utils/config';
import { logoutLocalStorage } from 'utils/token';
import { apiPathV1, apiPathV2 } from 'utils/constants';

const axiosApi = axios.create({
  baseURL: apiURL + apiPathV1,
});

const axiosApiV2 = axios.create({
  baseURL: apiURL + apiPathV2,
});

const authInterceptor = (config) => {
  const key = store.getState()?.auth?.tokens?.access;

  if (key) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${key}`,
    } as AxiosRequestHeaders;
  }

  return config;
};

const responseInterceptor = async (error) => {
  const originalRequest = error.config;

  const statusCode = error?.response?.status;
  const index = store;
  const { tokens } = index.getState().auth;
  if (
    tokens &&
    statusCode === 401 &&
    error.config &&
    !error.config._isReady &&
    error.response.data.messages
  ) {
    originalRequest._isReady = true;
    try {
      const resp = await axiosApi.post('/accounts/refresh/', { refresh: tokens.refresh });
      if (resp.status === 200) {
        const newTokens = resp.data;
        axiosApi.defaults.headers.Authorization = `Bearer ${newTokens.access}`;
        const usersLocal = {
          user: index.getState()?.auth?.user,
          token: {
            access: resp.data.access,
            refresh: tokens.refresh,
          },
        };
        index.dispatch(checkForTokens(usersLocal));
        const obj = {
          user: index.getState()?.auth?.user,
          token: {
            access: resp.data.access,
          },
        };
        localStorage.setItem('users', JSON.stringify(obj));
        window.dispatchEvent(new Event('storage'));
        return axiosApi(originalRequest);
      }
    } catch (e) {
      logoutLocalStorage();
      window.location.reload();
    }

    store.dispatch(logoutUser());
  }

  return Promise.reject(error);
};

axiosApi.interceptors.request.use(authInterceptor);
axiosApiV2.interceptors.request.use(authInterceptor);

axiosApi.interceptors.response.use(responseInterceptor);
axiosApiV2.interceptors.response.use(responseInterceptor);

export { axiosApi, axiosApiV2 };
