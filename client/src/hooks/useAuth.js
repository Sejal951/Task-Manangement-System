import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, logout } from '../store/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, error } = useSelector((state) => state.auth);

  const doLogin = useCallback((payload) => dispatch(login(payload)), [dispatch]);
  const doRegister = useCallback((payload) => dispatch(register(payload)), [dispatch]);
  const doLogout = useCallback(() => dispatch(logout()), [dispatch]);

  return {
    user,
    isAuthenticated,
    status,
    error,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
  };
}
