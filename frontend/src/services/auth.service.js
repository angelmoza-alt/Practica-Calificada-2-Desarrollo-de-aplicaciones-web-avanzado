import api from './api';

const login = async (username, password) => {
  const { data } = await api.post('/auth/signin', { username, password });
  // Guardamos la fecha de expiración para cerrar sesión cuando venza el token
  const user = { ...data, expiresAt: Date.now() + data.expiresIn * 1000 };
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

const register = (username, email, password) => api.post('/auth/signup', { username, email, password });

const logout = () => localStorage.removeItem('user');

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && user.expiresAt && Date.now() > user.expiresAt) {
    logout();
    return null;
  }
  return user;
};

export default { login, register, logout, getCurrentUser };
