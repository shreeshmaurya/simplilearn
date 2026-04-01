import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getUserByEmail, createUser, getSession, setSession, clearSession } from '../utils/storage';
import { initializeData } from '../data/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const found = getUserByEmail(email);
    if (!found) {
      return { success: false, error: 'No account found with this email' };
    }
    if (found.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }
    if (found.status === 'inactive') {
      return { success: false, error: 'Your account has been deactivated. Contact HR.' };
    }
    const sessionUser = { ...found };
    delete sessionUser.password;
    setUser(sessionUser);
    setSession(sessionUser);
    return { success: true, user: sessionUser };
  }, []);

  const signup = useCallback((userData) => {
    try {
      const newUser = createUser(userData);
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      setUser(sessionUser);
      setSession(sessionUser);
      return { success: true, user: sessionUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const refreshUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    setSession(updatedUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const isHR = user?.role === 'hr';
  const isEmployee = user?.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser, isHR, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
