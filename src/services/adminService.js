import supabase from '../lib/supabaseClient.js';

/**
 * Fetch admin-manageable user records through a privileged RPC.
 * This avoids direct SELECT policy recursion on public."user".
 *
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getUsers = async () => {
  try {
    const { data, error } = await supabase.rpc('admin_list_users');
    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Update record_status to 'ACTIVE'.
 * Uses an admin RPC so pending users are manageable without broad SELECT on user.
 * 
 * @param {string} userId - User ID to activate
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const activateUser = async (userId) => {
  try {
    const { data, error } = await supabase.rpc('admin_set_user_status', {
      target_user_id: userId,
      target_status: 'ACTIVE',
    });
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
 * Uses an admin RPC so SUPERADMIN protection happens in the database function.
 * 
 * @param {string} userId - User ID to deactivate
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const deactivateUser = async (userId) => {
  try {
    const { data, error } = await supabase.rpc('admin_set_user_status', {
      target_user_id: userId,
      target_status: 'INACTIVE',
    });
    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Fetch audit log rows through a privileged admin RPC.
 *
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getActivityLogs = async () => {
  try {
    const { data, error } = await supabase.rpc('admin_list_activity_logs');
    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Update user_type to 'ADMIN' or 'USER'.
 * Uses a SUPERADMIN-only RPC so role changes stay blocked for ADMIN
 * and locked for inactive or SUPERADMIN target accounts.
 *
 * @param {string} userId - User ID to change role for
 * @param {'ADMIN' | 'USER'} targetRole - Target role value
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const changeUserRole = async (userId, targetRole) => {
  try {
    const { data, error } = await supabase.rpc('admin_set_user_role', {
      target_user_id: userId,
      target_role: targetRole,
    });
    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
