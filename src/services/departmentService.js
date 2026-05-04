import supabase from '../lib/supabaseClient.js';

/**
 * Fetches departments from the database.
 * Security Logic: 'USER' type only sees ACTIVE records.
 * 'ADMIN' and 'SUPERADMIN' see all records.
 * 
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Array, error: null | Error}>}
 */
export const getDepts = async (userType) => {
  try {
    let query = supabase.from('department').select('*');

    // Apply filter for regular users - only show ACTIVE records
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }
    // ADMIN and SUPERADMIN see all records (no filter applied)

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
 * Adds a new department record to the database.
 * 
 * @param {Object} deptData - Department information to insert
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const addDept = async (deptData) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .insert([deptData])
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
 * Updates an existing department record by department code.
 * 
 * @param {string} deptCode - Department code to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const updateDept = async (deptCode, updateData) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .update(updateData)
      .eq('deptCode', deptCode)
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
 * Soft deletes a department by setting record_status to 'INACTIVE'.
 * 
 * @param {string} deptCode - Department code to soft delete
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const softDeleteDept = async (deptCode) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .update({ record_status: 'INACTIVE' })
      .eq('deptCode', deptCode)
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
 * Recovers a deleted department by setting record_status to 'ACTIVE'.
 * 
 * @param {string} deptCode - Department code to recover
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const recoverDept = async (deptCode) => {
  try {
    const { data, error } = await supabase
      .from('department')
      .update({ record_status: 'ACTIVE' })
      .eq('deptCode', deptCode)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
