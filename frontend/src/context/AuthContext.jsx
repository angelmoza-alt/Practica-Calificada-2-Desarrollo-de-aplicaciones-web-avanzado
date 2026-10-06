import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
  const [toast, setToast] = useState(null);

  const login = async (username, password) => {
    const u = await AuthService.login(username, password);
    setUser(u);
    return u;
  };

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  // Cierra sesión automáticamente cuando vence el token
  useEffect(() => {
    if (!user?.expiresAt) return;
    const ms = user.expiresAt - Date.now();
    const t = setTimeout(logout, Math.max(ms, 0));
    return () => clearTimeout(t);
  }, [user, logout]);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const value = useMemo(() => {
    const roles = user?.roles || [];
    return {
      user,
      login,
      logout,
      notify,
      isAdmin: roles.includes('ROLE_ADMIN'),
      isModerator: roles.includes('ROLE_MODERATOR'),
      // puede crear/editar = moderador o admin
      canEdit: roles.includes('ROLE_MODERATOR') || roles.includes('ROLE_ADMIN'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, logout, notify]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {toast && (
        <div className="toast-container-app">
          <div className={`alert alert-${toast.type} shadow d-flex align-items-center gap-2 mb-0`} role="alert">
            <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            {toast.message}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
