import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import { checkForTokens, logoutUser } from 'redux/auth/authSlice';
import store from 'redux/store';
import { TSetupAxiosInterceptor } from 'type';

import { apiUrlsV2, serverUrls, serverUrlsSocket } from 'utils/constants';
import { logoutLocalStorage } from 'utils/token';

const { REACT_APP_ENVIRONMENT } = process.env;

const appEnvironment = REACT_APP_ENVIRONMENT || 'local';

export const apiURL2 = apiUrlsV2[appEnvironment];
export const socketApiSocket = serverUrlsSocket[appEnvironment];

export const apiUrlCrop = serverUrls[appEnvironment];

export const setupAxiosInterceptors: TSetupAxiosInterceptor = (axiosInstance) => {
  return axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const key = store.getState()?.auth?.tokens?.access;

    if (key) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${key}`,
      } as AxiosRequestHeaders;
    }
    return config;
  });
};

export const setupAxiosInterceptorsResponse: TSetupAxiosInterceptor = (axiosInstance) => {
  return axiosInstance.interceptors.response.use(
    async (config) => {
      return config;
    },
    async (error) => {
      const originalRequest = error.config;

      const statusCode = error?.response?.status;
      const index = store;
      const { tokens } = index.getState().auth;
      if (
        tokens?.access &&
        statusCode === 401 &&
        error.config &&
        !error.config._isReady &&
        error.response.data.messages
      ) {
        originalRequest._isReady = true;
        try {
          const resp = await axiosInstance.post('/accounts/refresh/', { refresh: tokens.refresh });
          if (resp.status === 200) {
            const newTokens = resp.data;
            axiosInstance.defaults.headers.Authorization = `Bearer ${newTokens.access}`;
            const usersLocal = {
              access: resp.data.access,
              refresh: tokens.refresh,
              is_manager: tokens.is_manager,
            };
            index.dispatch(checkForTokens(usersLocal));
            const obj = {
              access: resp.data.access,
              is_manager: tokens.is_manager,
            };
            localStorage.setItem('users', JSON.stringify(obj));
            window.dispatchEvent(new Event('storage'));
            return axiosInstance(originalRequest);
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
};
