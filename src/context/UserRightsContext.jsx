import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import { useAuth } from './AuthContext';

const UserRightsContext = createContext({});

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRights = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('usermodule_rights')
          .select('right_id, right_value')
          .eq('userid', user.id);

        if (data) {
          // We convert the database rows into a "Map" 
          // Result looks like: { EMP_ADD: false, EMP_VIEW: true }
          const rightsMap = data.reduce((acc, row) => {
            acc[row.right_id] = row.right_value === 1;
            return acc;
          }, {});
          setRights(rightsMap);
        }
        setLoading(false);
      } else {
        setRights({});
      }
    };

    fetchRights();
  }, [user]);

  // This is the magic helper function for your teammates
  const can = (rightId) => !!rights[rightId];

  return (
    <UserRightsContext.Provider value={{ rights, can, loading }}>
      {children}
    </UserRightsContext.Provider>
  );
};

export const useRights = () => useContext(UserRightsContext);