import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  shop: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshShop: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [shop, setShop] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchShop = async (userId: string) => {
    try {
      const res = await fetch(`/api/shops/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setShop(data);
      } else {
        console.warn(`Failed to fetch shop, status: ${res.status}`);
        setShop(null);
      }
    } catch (err) {
      console.error('Failed to fetch shop:', err);
      setShop(null);
    }
  };

  const refreshShop = async () => {
    if (user) await fetchShop(user.id);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.warn('Supabase session fetch failed:', error);
          if (error.message.includes('Refresh Token Not Found')) {
            supabase.auth.signOut();
          }
          setSession(null);
          setUser(null);
        } else {
          const session = data?.session ?? null;
          setSession(session);
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) fetchShop(currentUser.id);
        }
      })
      .catch((err) => {
        console.warn('Supabase session fetch failed (catch):', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchShop(currentUser.id);
      } else {
        setShop(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, shop, loading, signOut, refreshShop }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
