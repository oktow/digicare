import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  me: () => api.get('/auth/me'),
  listUsers: () => api.get('/auth/users'),
  getUser: (id: number) => api.get(`/auth/users/${id}`),
  createUser: (data: any) => api.post('/auth/users', data),
  updateUser: (id: number, data: any) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/auth/users/${id}`),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/auth/change-password', data),
};

export const komplainAPI = {
  list: (params?: any) => api.get('/komplain', { params }),
  get: (id: number) => api.get(`/komplain/${id}`),
  create: (data: any) => api.post('/komplain', data),
  update: (id: number, data: any) => api.put(`/komplain/${id}`, data),
  delete: (id: number) => api.delete(`/komplain/${id}`),
};

export const insidenAPI = {
  list: (params?: any) => api.get('/insiden', { params }),
  get: (id: number) => api.get(`/insiden/${id}`),
  create: (data: any) => api.post('/insiden', data),
  update: (id: number, data: any) => api.put(`/insiden/${id}`, data),
  delete: (id: number) => api.delete(`/insiden/${id}`),
};

export const borAPI = {
  list: (params?: any) => api.get('/bor', { params }),
  create: (data: any) => api.post('/bor', data),
  update: (id: number, data: any) => api.put(`/bor/${id}`, data),
  delete: (id: number) => api.delete(`/bor/${id}`),
};

export const waktuTungguAPI = {
  list: (params?: any) => api.get('/waktu-tunggu', { params }),
  create: (data: any) => api.post('/waktu-tunggu', data),
  update: (id: number, data: any) => api.put(`/waktu-tunggu/${id}`, data),
  delete: (id: number) => api.delete(`/waktu-tunggu/${id}`),
};

export const dashboardAPI = {
  get: (params?: any) => api.get('/dashboard', { params }),
};
