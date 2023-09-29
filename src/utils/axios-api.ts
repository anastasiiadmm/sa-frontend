import axios, { AxiosRequestHeaders } from 'axios';

import { checkForTokens, clearTokens } from 'redux/auth/authSlice';
import store from 'redux/store';
import { apiURL } from 'utils/config';
import { addLocalStorage, getUserLocalStorage, logoutLocalStorage } from 'utils/storage';

const axiosApi = axios.create({
  baseURL: apiURL,
});

axiosApi.interceptors.request.use((config) => {
  const tokens = getUserLocalStorage();

  if (tokens?.access) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${tokens.access}`,
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
    const { tokens } = store.getState().auth;

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
            user: store.getState()?.auth?.user,
            token: {
              access: resp.data.access,
              refresh: tokens.refresh,
              is_manager: resp.data.is_manager,
            },
          };
          store.dispatch(checkForTokens({ access: newTokens.access }));
          addLocalStorage({
            access: usersLocal.token.access,
            refresh: usersLocal.token.refresh,
            is_manager: usersLocal?.token?.is_manager,
          });
          window.dispatchEvent(new Event('storage'));
          return axiosApi(originalRequest);
        }
      } catch {
        logoutLocalStorage();
        store.dispatch(clearTokens());
      }
    }

    return Promise.reject(error);
  },
);

export default axiosApi;
