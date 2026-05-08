import supabase from '../lib/supabaseClient.js';

/**
 * Fetches jobs from the database.
 * Security Logic: 'USER' type only sees ACTIVE records.
 * 'ADMIN' and 'SUPERADMIN' see all records.
 * 
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Array, error: null | Error}>}
 */
export const getJobs = async (userType) => {
  try {
    let query = supabase.from('job').select('*');

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
 * Adds a new job record to the database.
 * 
 * @param {Object} jobData - Job information to insert
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const addJob = async (jobData) => {
  try {
    const { data, error } = await supabase
      .from('job')
      .insert([jobData])
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
 * Updates an existing job record by job code.
 * 
 * @param {string} jobCode - Job code to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const updateJob = async (jobCode, updateData) => {
  try {
    const { data, error } = await supabase
      .from('job')
      .update(updateData)
      .eq('jobcode', jobCode)
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
 * Soft deletes a job by setting record_status to 'INACTIVE'.
 * 
 * @param {string} jobCode - Job code to soft delete
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const softDeleteJob = async (jobCode) => {
  try {
    const { data, error } = await supabase
      .from('job')
      .update({ record_status: 'INACTIVE' })
      .eq('jobcode', jobCode)
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
 * Recovers a deleted job by setting record_status to 'ACTIVE'.
 * 
 * @param {string} jobCode - Job code to recover
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const recoverJob = async (jobCode) => {
  try {
    const { data, error } = await supabase
      .from('job')
      .update({ record_status: 'ACTIVE' })
      .eq('jobcode', jobCode)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
