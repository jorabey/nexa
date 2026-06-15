import { api, setAccessToken } from './client';

export const authApi = {
  sendOtp: (email) => api.post('/client/auth/send-otp', { email }, { skipAuth: true }),

  register: (payload) =>
    api.post('/client/auth/register', payload, { skipAuth: true }).then((data) => {
      setAccessToken(data.accessToken);
      return data;
    }),

  login: (identifier, password) =>
    api.post('/client/auth/login', { identifier, password }, { skipAuth: true }).then((data) => {
      setAccessToken(data.accessToken);
      return data;
    }),

  logout: () =>
    api.post('/client/auth/logout', {}).finally(() => setAccessToken(null)),
};
