import supabase from '../lib/supabaseClient.js';
import { makeStamp } from '../utils/makeStamp.js';

/**
 * Fetches ALL job history records across all employees.
 * Security Logic: 'USER' type only sees ACTIVE records.
 * Used by the standalone /jobhistory page.
 * 
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Array, error: null | Error}>}
 */
export const getAllJobHistory = async (userType) => {
  try {
    let query = supabase
      .from('jobhistory')
      .select('*');

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
      .from('jobhistory')
      .select('*')
      .eq('empno', empNo);

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
      .from('jobhistory')
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
export const updateJobHistory = async (empNo, jobCode, effDate, updateData) => {
  try {
    const { data, error } = await supabase
      .from('jobhistory')
      .update(updateData)
      .eq('empno', empNo)
      .eq('jobcode', jobCode)
      .eq('effdate', effDate)
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
 * Returns the most recently recorded deptCode for a given jobCode.
 * Used to pre-populate the department field in JobHistoryModal when a job is selected.
 *
 * @param {string} jobCode - Job code to look up
 * @returns {Promise<{deptCode: string | null, error: null | Error}>}
 */
export const getDeptCodeForJob = async (jobCode) => {
  try {
    const { data, error } = await supabase
      .from('jobhistory')
      .select('deptcode, effdate')
      .eq('jobcode', jobCode)
      .eq('record_status', 'ACTIVE')
      .order('effdate', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return { deptCode: data?.deptcode || null, error: null };
  } catch (err) {
    return { deptCode: null, error: err };
  }
};

/**
 * Soft deletes a job history record by setting record_status to 'INACTIVE'.
 * 
 * @param {number | string} id - Job history record ID to soft delete
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const softDeleteJobHistory = async (empNo, jobCode, effDate, userId) => {
  try {
    const { data, error } = await supabase
      .from('jobhistory')
      .update({
        record_status: 'INACTIVE',
        stamp: makeStamp('DEACTIVATED', userId)
      })
      .eq('empno', empNo)
      .eq('jobcode', jobCode)
      .eq('effdate', effDate)
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
export const recoverJobHistory = async (empNo, jobCode, effDate, userId) => {
  try {
    const { data, error } = await supabase
      .from('jobhistory')
      .update({
        record_status: 'ACTIVE',
        stamp: makeStamp('REACTIVATED', userId)
      })
      .eq('empno', empNo)
      .eq('jobcode', jobCode)
      .eq('effdate', effDate)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
