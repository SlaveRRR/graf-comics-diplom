import { AccesTokenResponse, SignInParams, SignUpParams, User } from '@types';
import axios from 'axios';

import {
  CURRENT_USER_ENDPOINT,
  LOGOUT_ENDPOINT,
  REFRESH_TOKEN_ENDPOINT,
  SIGNIN_ENDPOINT,
  SIGNUP_ENDPOINT,
} from '@constants';
import { axiosInstance } from './utils';

class Api {
  async signIn(data: SignInParams) {
    return axiosInstance.post<AccesTokenResponse>(SIGNIN_ENDPOINT, data);
  }

  async signUp(data: SignUpParams) {
    return axiosInstance.post<AccesTokenResponse>(SIGNUP_ENDPOINT, data);
  }

  async refreshToken() {
    return axios.get<AccesTokenResponse>(REFRESH_TOKEN_ENDPOINT, { withCredentials: true });
  }

  async logout() {
    return axiosInstance.post(LOGOUT_ENDPOINT);
  }
  async getCurrentUser() {
    return axiosInstance.get<User>(CURRENT_USER_ENDPOINT);
  }
}

export const api = new Api();
