import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthStateChange = async (event, session) => {
      try {
        if (session?.user) {
          // Check database for active status
          const { data } = await supabase
            .from('user')
            .select('record_status')
            .eq('userid', session.user.id)
            .single();

          if (data?.record_status === 'INACTIVE') {
            await supabase.auth.signOut();
            setUser(null);
            alert("Access Denied: Your account is currently INACTIVE.");
          } else {
            setUser(session.user);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth Listener Error:", err);
      } finally {
        setLoading(false); // Ensure app unfreezes
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('SIGNED_IN', session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* If we don't wait for loading here, ProtectedRoute will fail instantly */}
      {!loading ? children : (
        <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-zinc-500 tracking-widest uppercase text-xs">
          Initialising Hope Evolution...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);