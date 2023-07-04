import axios, { AxiosRequestHeaders } from 'axios';

import { checkForTokens } from 'redux/auth/authSlice';
import store from 'redux/store';
import { deleteCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';
import { addLocalStorage, logoutLocalStorage } from 'utils/addLocalStorage/addLocalStorage';
import { apiURL } from 'utils/config';

const axiosApi = axios.create({
  baseURL: apiURL,
});

axiosApi.interceptors.request.use(async (config) => {
  const key = store.getState()?.auth?.tokens?.access;

  if (key) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${key}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

axiosApi.interceptors.response.use(
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
          index.dispatch(checkForTokens({ access: newTokens.access }));
          addLocalStorage({
            access: usersLocal.token.access,
            is_manager: index.getState()?.auth?.tokens?.is_manager,
          });
          window.dispatchEvent(new Event('storage'));
          return axiosApi(originalRequest);
        }
      } catch (e) {
        if (
          e?.response?.status === 401 ||
          e?.response?.status === 400 ||
          e?.response?.status === 404
        ) {
          logoutLocalStorage();
          deleteCookie(nameRefreshCookies);
          window.location.reload();
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosApi;
