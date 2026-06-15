import { api } from './client';

export const connectionsApi = {
  getMyConnections: ({ page = 1, limit = 50 } = {}) =>
    api.get(`/client/connections?page=${page}&limit=${limit}`),

  connect: (appId, scopes = []) => api.post('/client/connections', { appId, scopes }),

  disconnect: (appId) => api.post('/client/connections/disconnect', { appId }),

  // NOTE: block/report endpoints are not yet implemented on the server
  // (UserAppConnection model supports status:'blocked' and AppReport model
  // exists, but no routes are wired). These call placeholder paths so the
  // UI/UX is complete; wire up matching routes server-side to activate.
  block: (appId) => api.post('/client/connections/block', { appId }),
  unblock: (appId) => api.post('/client/connections/unblock', { appId }),
  report: (appId, reason, description) =>
    api.post('/client/connections/report', { appId, reason, description }),
};
