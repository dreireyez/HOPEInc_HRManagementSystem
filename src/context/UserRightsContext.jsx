/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const UserRightsContext = createContext({});

const ADMIN_BASELINE_RIGHTS = new Set([
  'EMP_VIEW',
  'EMP_VIEW_ALL',
  'EMP_ADD',
  'EMP_EDIT',
  'JH_VIEW',
  'JH_ADD',
  'JH_EDIT',
  'JOB_VIEW',
  'JOB_ADD',
  'JOB_EDIT',
  'DEPT_VIEW',
  'DEPT_ADD',
  'DEPT_EDIT',
  'ADM_USER',
  'SYS_INTEGRITY',
]);

export const UserRightsProvider = ({ children }) => {
  const { user } = useAuth();
  const [rights, setRights] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRights = async () => {
      if (!user) {
        setRights({});
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const loadSingleUser = async () => {
          const variants = ['userid', 'userId'];

          for (const key of variants) {
            const { data, error } = await supabase
              .from('user')
              .select(`${key}, user_type, record_status`)
              .eq(key, user.id)
              .maybeSingle();

            if (!error && data) {
              return {
                userid: data[key],
                user_type: data.user_type,
                record_status: data.record_status,
              };
            }
          }

          return null;
        };

        const loadRightsRows = async () => {
          const variants = ['user_id', 'userid', 'userId'];

          for (const key of variants) {
            const { data, error } = await supabase
              .from('usermodule_rights')
              .select('right_id, right_value')
              .eq(key, user.id);

            if (!error) {
              return data || [];
            }
          }

          return null;
        };

        const userData = await loadSingleUser();

        if (!userData) {
          throw new Error('Unable to load current user profile');
        }

        setCurrentUser(userData);

        const data = await loadRightsRows();

        if (data) {
          const isEnabledRight = (value) => {
            if (value === true || value === 1) {
              return true;
            }

            if (typeof value === 'string') {
              const normalized = value.trim().toLowerCase();
              return normalized === '1' || normalized === 'true' || normalized === 'yes';
            }

            return false;
          };

          const rightsMap = data.reduce((acc, row) => {
            const rightKey = String(row.right_id || row.rightId || '')
              .trim()
              .toUpperCase();

            if (rightKey) {
              acc[rightKey] = isEnabledRight(row.right_value ?? row.rightValue);
            }

            return acc;
          }, {});
          setRights(rightsMap);
        } else {
          setRights({});
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

  const can = (rightId) => {
    const normalizedRightId = String(rightId || '')
      .trim()
      .toUpperCase();

    if (currentUser?.user_type === 'SUPERADMIN') {
      return true;
    }

    if (currentUser?.user_type === 'ADMIN' && ADMIN_BASELINE_RIGHTS.has(normalizedRightId)) {
      return true;
    }

    return !!rights[normalizedRightId];
  };

  return (
    <UserRightsContext.Provider value={{ rights, can, loading, currentUser }}>
      {children}
    </UserRightsContext.Provider>
  );
};

// Rubric Requirement: export useRights() hook
export const useRights = () => useContext(UserRightsContext);
