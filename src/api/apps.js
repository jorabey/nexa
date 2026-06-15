import { api } from './client';

export const appsApi = {
  getApps: ({ page = 1, limit = 20, sortBy = 'rating' } = {}) =>
    api.get(`/client/apps?page=${page}&limit=${limit}&sortBy=${sortBy}`, { skipAuth: true }),

  searchApps: ({ q, page = 1, limit = 20 }) =>
    api.get(`/client/apps/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`, {
      skipAuth: true,
    }),

  // 🚀 TUZATILDI: { skipAuth: true } olib tashlandi, endi token yuboriladi
  getAppDetails: (username) =>
    api.get(`/client/apps/${encodeURIComponent(username)}`), 
};