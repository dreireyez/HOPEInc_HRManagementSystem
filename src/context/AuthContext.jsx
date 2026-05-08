/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleAuthStateChange = async (event, session) => {
      if (event === 'INITIAL' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        setLoading(true);
      }

      if (session?.user) {
        try {
          const userId = session.user.id;

          // 1. Try to fetch user
          let { data, error } = await supabase
            .from('user')
            .select('record_status')
            .eq('userid', userId)
            .single();

          // 2. If NOT FOUND → provision securely
          if (error || !data) {
            await supabase.rpc('provision_new_user');

            // Re-fetch after provisioning
            const res = await supabase
              .from('user')
              .select('record_status')
              .eq('userid', userId)
              .single();

            data = res.data;
          }

          if (mounted) {
            // 3. Login guard
            if (data?.record_status !== 'ACTIVE') {
              await supabase.auth.signOut();
              setUser(null);
              alert("Your account is pending activation by an administrator.");
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthStateChange(event, session);
      }
    );

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
