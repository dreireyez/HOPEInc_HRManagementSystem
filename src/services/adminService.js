import supabase from '../lib/supabaseClient.js';

/**
 * Fetch all profiles from the user table.
 * Security Logic: 'USER' type only sees ACTIVE records.
 * 'ADMIN' and 'SUPERADMIN' see all records.
 * 
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getUsers = async (userType) => {
  try {
    let query = supabase.from('user').select('*');

    // Apply filter for regular users - only show ACTIVE records
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;

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

/**
 * Update user_type for a non-SUPERADMIN user.
 * Allowed values: 'ADMIN', 'USER'.
 * CRITICAL Logic: Prevents SUPERADMIN role assignment or modification.
 *
 * @param {string} userId - User ID to update
 * @param {'ADMIN'|'USER'} newRole - New role to assign
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const changeUserRole = async (userId, newRole) => {
  try {
    const superadmin = await isSuperAdmin(userId);
    if (superadmin) {
      throw new Error("SUPERADMIN accounts cannot be modified");
    }

    if (!['ADMIN', 'USER'].includes(newRole)) {
      throw new Error("Invalid role. Allowed values: ADMIN, USER");
    }

    const { data, error } = await supabase
      .from('user')
      .update({ user_type: newRole })
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
 * Fetch all rights with their module grouping from the rights table.
 * Used to build the rights panel UI dynamically from the DB schema.
 *
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getRightsSchema = async () => {
  const { data, error } = await supabase
    .from('rights')
    .select('right_id, right_name, module_id')
    .eq('record_status', 'ACTIVE')
    .order('module_id')
    .order('right_id');
  if (error) return { data: null, error };
  return { data, error: null };
};

/**
 * Fetch all usermodule_rights rows for a given user.
 *
 * @param {string} userId - UUID of the user
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getUserRights = async (userId) => {
  const { data, error } = await supabase
    .from('usermodule_rights')
    .select('right_id, right_value')
    .eq('userid', userId);
  if (error) return { data: null, error };
  return { data, error: null };
};

/**
 * Upsert a single right value for a user in usermodule_rights.
 *
 * @param {string} userId - UUID of the user
 * @param {string} rightId - right_id to update
 * @param {number} value - 1 to grant, 0 to revoke
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const updateUserRight = async (userId, rightId, value) => {
  const { data, error } = await supabase
    .from('usermodule_rights')
    .upsert(
      { userid: userId, right_id: rightId, right_value: value },
      { onConflict: 'userid,right_id' }
    )
    .select();
  if (error) return { data: null, error };
  return { data, error: null };
};

