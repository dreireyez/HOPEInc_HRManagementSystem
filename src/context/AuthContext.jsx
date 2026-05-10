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
        <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-outline-variant)]/40 border-t-[var(--color-primary-container)] animate-spin" />
            </div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-[var(--color-on-surface-variant)] animate-pulse">
              Loading…
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
