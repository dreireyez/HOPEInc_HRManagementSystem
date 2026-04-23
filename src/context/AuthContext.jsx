import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Define the function that checks the database
    const handleAuthStateChange = async (event, session) => {
      if (session?.user) {
        // --- THE LOGIN GUARD START ---
        const { data, error } = await supabase
          .from('user') // Matches your table name in Supabase
          .select('record_status')
          .eq('userid', session.user.id)
          .single();

        if (data?.record_status === 'INACTIVE') {
          // If they aren't ACTIVE, kick them out immediately!
          await supabase.auth.signOut();
          setUser(null);
          alert("Access Denied: Your account is currently INACTIVE.");
          return;
        }
        // --- THE LOGIN GUARD END ---

        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    // 2. Run the check immediately for the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('SIGNED_IN', session);
    });

    // 3. This is the "Listener" that waits for logins/logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);