import supabase from '../lib/supabaseClient.js';

/**
 * Fetch all profiles from the user table.
 * 
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getUsers = async () => {
  try {
    const { data, error } = await supabase.from('user').select('*');

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Helper function to verify if a user is a SUPERADMIN.
 * 
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} True if user is SUPERADMIN
 */
const isSuperAdmin = async (userId) => {
  const { data, error } = await supabase
    .from('user')
    .select('user_type')
    .eq('userid', userId)
    .single();

  if (error) {
    throw error;
  }

  return data?.user_type === 'SUPERADMIN';
};

/**
 * Update record_status to 'ACTIVE'.
 * CRITICAL Logic: Prevents API-level modification of SUPERADMIN accounts.
 * 
 * @param {string} userId - User ID to activate
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const activateUser = async (userId) => {
  try {
    const superadmin = await isSuperAdmin(userId);
    if (superadmin) {
      throw new Error("SUPERADMIN accounts cannot be modified");
    }

    const { data, error } = await supabase
      .from('user')
      .update({ record_status: 'ACTIVE' })
      .eq('userid', userId)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Update record_status to 'INACTIVE'.
 * CRITICAL Logic: Prevents API-level modification of SUPERADMIN accounts.
 * 
 * @param {string} userId - User ID to deactivate
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const deactivateUser = async (userId) => {
  try {
    const superadmin = await isSuperAdmin(userId);
    if (superadmin) {
      throw new Error("SUPERADMIN accounts cannot be modified");
    }

    const { data, error } = await supabase
      .from('user')
      .update({ record_status: 'INACTIVE' })
      .eq('userid', userId)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
