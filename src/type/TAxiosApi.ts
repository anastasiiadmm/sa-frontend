import { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';

type AxiosApiInstance = AxiosInstance & {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
};

export type TSetupAxiosInterceptor = (axiosInstance: AxiosApiInstance) => number;
