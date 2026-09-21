import api from './api';

export async function fetchTasks(params = {}) {
  const { data } = await api.get('/tasks', { params });
  return data.tasks;
}

export async function fetchTaskById(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data.task;
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data.task;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.task;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get('/users');
  return data.users;
}
