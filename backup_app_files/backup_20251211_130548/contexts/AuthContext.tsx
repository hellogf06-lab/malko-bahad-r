import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
    // Supabase oturumunu dinle ve user state'ini güncelle
    useEffect(() => {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          setUser(session.user);
          setSession(session);
          localStorage.setItem('auth_user', JSON.stringify(session.user));
        } else {
          setUser(null);
          setSession(null);
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_profile');
        }
      });
      return () => {
        listener?.subscription?.unsubscribe();
      };
    }, []);
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

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      setUser(data.user);
      setSession(data.session);
      // Profil sorgusu (örneğin supabase'da profiles tablosu varsa)
      // const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', data.user.id).single();
      // setProfile(profileData);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
      if (error) return { error };
      setUser(data.user);
      setSession(data.session);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
