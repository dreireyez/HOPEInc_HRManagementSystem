import supabase from '../lib/supabaseClient.js';
import { makeStamp } from '../utils/makeStamp.js';

const todayISODate = () => new Date().toISOString().slice(0, 10);

/**
 * Fetches employees from the database.
 * Security Logic: 'USER' type only sees ACTIVE records.
 * 'ADMIN' and 'SUPERADMIN' see all records.
 * 
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Array, error: null | Error}>}
 */
export const getEmployees = async (userType) => {
  try {
    let query = supabase.from('employee').select('*');

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
 * Fetches a single employee by employee number.
 * Security Logic: 'USER' type can only see ACTIVE records.
 * 
 * @param {number | string} empNo - Employee number to fetch
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const getEmployee = async (empNo, userType) => {
  try {
    let query = supabase
      .from('employee')
      .select('*')
      .eq('empno', empNo);

    // Apply filter for regular users - only show ACTIVE records
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Adds a new employee record to the database.
 * 
 * @param {Object} employeeData - Employee information to insert
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const addEmployee = async (employeeData) => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .insert([employeeData])
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
 * Updates an existing employee record by employee number.
 * 
 * @param {number | string} empNo - Employee number to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const updateEmployee = async (empNo, updateData, userId) => {
  try {
    // If sepdate is being introduced on an ACTIVE employee, treat the edit as
    // a soft-delete: the DB trigger will also catch direct DB writes; doing it
    // here keeps the audit stamp consistent (DEACTIVATED + actor short id).
    if (updateData && updateData.sepdate) {
      const { data: existing } = await supabase
        .from('employee')
        .select('sepdate, record_status')
        .eq('empno', empNo)
        .maybeSingle();
      const wasActive = !existing?.sepdate && existing?.record_status === 'ACTIVE';
      if (wasActive) {
        const merged = {
          ...updateData,
          record_status: 'INACTIVE',
          stamp: makeStamp('DEACTIVATED', userId),
        };
        const { data, error } = await supabase
          .from('employee')
          .update(merged)
          .eq('empno', empNo)
          .select();
        if (error) throw error;
        return { data, error: null };
      }
    }

    const { data, error } = await supabase
      .from('employee')
      .update(updateData)
      .eq('empno', empNo)
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
 * Soft deletes an employee by setting record_status to 'INACTIVE'.
 * 
 * @param {number | string} empNo - Employee number to soft delete
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const softDeleteEmployee = async (empNo, userId) => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .update({
        record_status: 'INACTIVE',
        sepdate: todayISODate(),
        stamp: makeStamp('DEACTIVATED', userId)
      })
      .eq('empno', empNo)
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
 * Builds a Map<empno, deptCode> by querying jobHistory directly.
 * Picks the most recent deptCode per employee based on effDate.
 * Security Logic: USER sees only ACTIVE jobHistory rows.
 * ADMIN and SUPERADMIN see all rows, enabling department filtering for inactive employees.
 *
 * @param {string} userType - Type of user ('USER', 'ADMIN', 'SUPERADMIN')
 * @returns {Promise<{data: Map<string, string> | null, error: null | Error}>}
 */
export const getEmployeeDeptMap = async (userType) => {
  try {
    let query = supabase
      .from('jobhistory')
      .select('empno, deptcode, effdate');

    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const map = new Map();
    for (const row of data || []) {
      const existing = map.get(row.empno);
      if (!existing || row.effdate > existing.effdate) {
        map.set(row.empno, { effdate: row.effdate, deptcode: row.deptcode });
      }
    }

    const deptMap = new Map();
    for (const [empNo, val] of map) {
      deptMap.set(empNo, val.deptcode);
    }

    return { data: deptMap, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Returns the next available employee number as a zero-padded VARCHAR(5) string.
 * Fetches all empno values and derives the next integer in sequence.
 * The field must be treated as auto-assigned and must not accept manual input.
 *
 * @returns {Promise<{data: string | null, error: null | Error}>}
 */
export const getNextEmpNo = async () => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select('empno');

    if (error) throw error;

    const max = (data || []).reduce((acc, row) => {
      const n = parseInt(row.empno, 10);
      return isNaN(n) ? acc : Math.max(acc, n);
    }, 0);

    return { data: String(max + 1).padStart(5, '0'), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Recovers a deleted employee by setting record_status to 'ACTIVE'.
 *
 * @param {number | string} empNo - Employee number to recover
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const recoverEmployee = async (empNo, userId) => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .update({
        record_status: 'ACTIVE',
        sepdate: null,
        stamp: makeStamp('REACTIVATED', userId)
      })
      .eq('empno', empNo)
      .select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
