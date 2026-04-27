import axios, { InternalAxiosRequestConfig } from 'axios';

import { API_ENDPOINT, REFRESH_TOKEN_ENDPOINT, SIGNIN_ENDPOINT, SOCIAL_SESSION_EXCHANGE_ENDPOINT } from '@constants';

export const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

let refreshRequest: Promise<string> | null = null;

const shouldSkipRefresh = (requestUrl?: string) => {
  if (!requestUrl) {
    return false;
  }

  return [
    REFRESH_TOKEN_ENDPOINT,
    '/token/refresh/',
    SIGNIN_ENDPOINT,
    '/signin/',
    SOCIAL_SESSION_EXCHANGE_ENDPOINT,
  ].some((path) => requestUrl.includes(path));
};

export const addAuthHeaderInterceptor = (config: InternalAxiosRequestConfig) => {
  const storedToken = localStorage.getItem('token');
  let token = storedToken;

  if (storedToken) {
    try {
      token = JSON.parse(storedToken);
    } catch {
      token = storedToken;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const refreshTokenOnError = async (error) => {
  const originalRequest = error.config;

  if (!error.response || !originalRequest) {
    return Promise.reject(error);
  }

  if (shouldSkipRefresh(originalRequest?.url)) {
    localStorage.removeItem('token');
    return Promise.reject(error);
  }

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = axios.get(REFRESH_TOKEN_ENDPOINT, { withCredentials: true }).then((response) => {
          const nextToken = response.data['access_token'];

          localStorage.setItem('token', JSON.stringify(nextToken));

          return nextToken;
        });
      }

      const nextToken = await refreshRequest;

      originalRequest.headers.Authorization = `Bearer ${nextToken}`;

      return axiosInstance.request(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('token');
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = null;
    }
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(addAuthHeaderInterceptor);

axiosInstance.interceptors.response.use((config) => config, refreshTokenOnError);
