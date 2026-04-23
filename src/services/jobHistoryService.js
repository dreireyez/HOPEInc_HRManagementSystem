import supabase from '../lib/supabaseClient.js';

/**
 * Fetches job history records for a specific employee.
 * Security Logic: 'USER' type only sees ACTIVE records.
 * 'ADMIN' and 'SUPERADMIN' see all records for the employee.
 * 
 * @param {number | string} empNo - Employee number to fetch history for
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Array, error: null | Error}>}
 */
export const getJobHistory = async (empNo, userType) => {
  try {
    let query = supabase
      .from('jobHistory')
      .select('*')
      .eq('emp_no', empNo);

    // Apply filter for regular users - only show ACTIVE records
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }
    // ADMIN and SUPERADMIN see all records (no additional filter applied)

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
 * Adds a new job history record to the database.
 * 
 * @param {Object} historyData - Job history information to insert
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const addJobHistory = async (historyData) => {
  try {
    const { data, error } = await supabase
      .from('jobHistory')
      .insert([historyData])
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
 * Updates an existing job history record by ID.
 * 
 * @param {number | string} id - Job history record ID to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const updateJobHistory = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('jobHistory')
      .update(updateData)
      .eq('id', id)
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
 * Soft deletes a job history record by setting record_status to 'INACTIVE'.
 * 
 * @param {number | string} id - Job history record ID to soft delete
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const softDeleteJobHistory = async (id) => {
  try {
    const { data, error } = await supabase
      .from('jobHistory')
      .update({ record_status: 'INACTIVE' })
      .eq('id', id)
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
 * Recovers a deleted job history record by setting record_status to 'ACTIVE'.
 * 
 * @param {number | string} id - Job history record ID to recover
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const recoverJobHistory = async (id) => {
  try {
    const { data, error } = await supabase
      .from('jobHistory')
      .update({ record_status: 'ACTIVE' })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
