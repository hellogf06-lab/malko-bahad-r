import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';

type UserRole = 'admin' | 'user';

interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // LocalStorage'dan kullanıcıyı yükle
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    // LocalStorage'dan profili yükle
    const savedProfile = localStorage.getItem('auth_profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const [loading, setLoading] = useState(false); // Mock mode - no loading

  // Mock mode - loading kontrolünü kaldır
  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    try {
      console.log('🔐 AuthContext signIn:', email);
      // Mock mode - create a fake user
      const mockUser: any = {
        id: 'mock-user-123',
        email: email,
        created_at: new Date().toISOString(),
      };
      
      const mockProfile: UserProfile = {
        id: 'mock-user-123',
        user_id: 'mock-user-123',
        role: 'admin',
        full_name: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setProfile(mockProfile);
      
      // LocalStorage'a kaydet
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_profile', JSON.stringify(mockProfile));

      console.log('✅ Mock user created and saved:', { email, role: 'admin' });
      return { error: null };
    } catch (error) {
      console.log('❌ SignIn error:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, _password: string, metadata?: any) => {
    try {
      // Mock mode - create a fake user
      const mockUser: any = {
        id: 'mock-user-' + Date.now(),
        email: email,
        created_at: new Date().toISOString(),
      };
      
      const mockProfile: UserProfile = {
        id: mockUser.id,
        user_id: mockUser.id,
        role: 'user',
        full_name: metadata?.full_name || email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(mockUser);
      setProfile(mockProfile);
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_profile', JSON.stringify(mockProfile));

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_profile');
  };

  const value = {
    user,
    session,
    profile,
    role: profile?.role ?? null,
    isAdmin: profile?.role === 'admin',
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
