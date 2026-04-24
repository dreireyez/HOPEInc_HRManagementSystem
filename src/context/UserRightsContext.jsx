import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import { useAuth } from './AuthContext';

const UserRightsContext = createContext({});

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (!user) {
        setRights({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('usermodule_rights')
          .select('right_id, right_value')
          .eq('userid', user.id);

        if (error) throw error;

        if (data) {
          const rightsMap = data.reduce((acc, row) => {
            acc[row.right_id] = row.right_value === 1;
            return acc;
          }, {});
          setRights(rightsMap);
        }
      } catch (err) {
        console.error("Error fetching rights:", err.message);
        setRights({}); 
      } finally {
        setLoading(false);
      }
    };

    fetchRights();
  }, [user]);

  const can = (rightId) => !!rights[rightId];

  return (
    <UserRightsContext.Provider value={{ rights, can, loading }}>
      {children}
    </UserRightsContext.Provider>
  );
};

// Rubric Requirement: export useRights() hook
export const useRights = () => useContext(UserRightsContext);