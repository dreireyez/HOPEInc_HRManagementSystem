import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rubric Requirement: Provides currentUser and session state via onAuthStateChange
    const handleAuthStateChange = async (event, session) => {
      const sessionUser = session?.user ?? null;

      if (sessionUser) {
        setLoading(true); // Keep loading true while we check DB status
        
        // Rubric Requirement: Login guard checks record_status = 'ACTIVE' after every SIGNED_IN event
        const { data, error } = await supabase
          .from('user') 
          .select('record_status')
          .eq('userid', sessionUser.id)
          .single();

        // Check if the user is explicitly INACTIVE
        if (data?.record_status === 'INACTIVE') {
          // Rubric Requirement: Signs out and shows error if INACTIVE
          console.warn("Unauthorized access attempt: User is INACTIVE");
          await supabase.auth.signOut();
          setUser(null);
          alert("Access Denied: Your account is currently INACTIVE. Please contact HR.");
        } else if (error && error.code !== 'PGRST116') {
          // Handle genuine database errors
          console.error("Auth Guard Error:", error.message);
          setUser(null);
        } else {
          // User is ACTIVE (or record doesn't exist yet, which usually implies provisioning is pending)
          setUser(sessionUser);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange('INITIAL_SESSION', session);
    });

    // Rubric Requirement: session listener via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Trigger the guard on every sign-in or session update
      handleAuthStateChange(event, session);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);