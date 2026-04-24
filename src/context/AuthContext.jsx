import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthStateChange = async (event, session) => {
      // Only trigger the "Synchronizing" overlay for major identity changes
      if (event === 'INITIAL' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(true);
      }

      if (session?.user) {
        try {
          const { data } = await supabase
            .from('user')
            .select('record_status')
            .eq('userid', session.user.id)
            .single();

          if (mounted) {
            if (data?.record_status === 'INACTIVE') {
              await supabase.auth.signOut();
              setUser(null);
              alert("Access Denied: Your account is currently INACTIVE.");
            } else {
              setUser(session.user);
            }
          }
        } catch (err) {
          console.error("Auth Guard Error:", err);
          if (mounted) setUser(null);
        }
      } else {
        if (mounted) setUser(null);
      }
      
      if (mounted) setLoading(false);
    };

    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL', session);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Trigger the guard on every sign-in or session update
      handleAuthStateChange(event, session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading ? children : (
        <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
          <div className="text-white font-black animate-pulse tracking-widest text-xs uppercase">
            Synchronizing...
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);