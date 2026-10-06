import api from './api';

// Crea las funciones CRUD para un recurso de la API
const crud = (recurso) => ({
  getAll: (params) => api.get(`/${recurso}`, { params }).then((r) => r.data),
  get: (id) => api.get(`/${recurso}/${id}`).then((r) => r.data),
  create: (data) => api.post(`/${recurso}`, data).then((r) => r.data),
  update: (id, data) => api.put(`/${recurso}/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/${recurso}/${id}`).then((r) => r.data),
});

export const laboratorioService = crud('laboratorios');
export const medicamentoService = crud('medicamentos');

export const userService = {
  me: () => api.get('/users/me').then((r) => r.data),
  stats: () => api.get('/users/stats').then((r) => r.data),
  getAll: () => api.get('/users').then((r) => r.data),
  updateRoles: (id, roles) => api.put(`/users/${id}/roles`, { roles }).then((r) => r.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};
