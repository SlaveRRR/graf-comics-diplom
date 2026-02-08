import { API_ENDPOINT, REFRESH_TOKEN_ENDPOINT } from '@constants';
import { message } from 'antd';
import axios, { InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

export const addAuthHeaderInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = JSON.parse(localStorage.getItem('token'));

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const refreshTokenOnError = async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const response = await axios.get(REFRESH_TOKEN_ENDPOINT, { withCredentials: true });

      localStorage.setItem('token', JSON.stringify(response.data['access_token']));

      return axiosInstance.request(originalRequest);
    } catch (error) {
      message.error(error?.message);
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(addAuthHeaderInterceptor);

axiosInstance.interceptors.response.use((config) => config, refreshTokenOnError);
