import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authAPI, usersAPI } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, displayName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'displayName' | 'bio' | 'avatar' | 'coverImage'>>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = authAPI.login(email, password);
    setUser(loggedInUser);
  }, []);

  const register = useCallback(async (username: string, displayName: string, email: string, password: string) => {
    const newUser = authAPI.register(username, displayName, email, password);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<User, 'displayName' | 'bio' | 'avatar' | 'coverImage'>>) => {
    if (!user) return;
    const updated = usersAPI.updateProfile(user.id, updates);
    setUser({ ...updated, password: '' });
  }, [user]);

  const refreshUser = useCallback(() => {
    if (!user) return;
    const refreshed = authAPI.getCurrentUser();
    setUser(refreshed);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
