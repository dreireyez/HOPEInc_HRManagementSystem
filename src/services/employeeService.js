import supabase from '../lib/supabaseClient.js';

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
    // Query 1: employee table (record_status, stamp, all HR fields)
    let empQuery = supabase
      .from('employee')
      .select('empno, lastname, firstname, gender, hiredate, sepdate, record_status, stamp');

    if (userType === 'USER') {
      empQuery = empQuery.eq('record_status', 'ACTIVE');
    }

    // Query 2: employee_current_job view (jobdesc, deptname keyed by empno)
    // Views cannot be joined via PostgREST FK syntax — must query separately
    const [empRes, viewRes] = await Promise.all([
      empQuery,
      supabase.from('employee_current_job').select('empno, jobdesc, deptname'),
    ]);

    if (empRes.error) throw empRes.error;

    // Build a lookup map from the view: empno → { jobdesc, deptname }
    const jobMap = {};
    if (!viewRes.error && viewRes.data) {
      for (const row of viewRes.data) {
        jobMap[row.empno] = { jobdesc: row.jobdesc, deptname: row.deptname };
      }
    }

    // Merge view data into each employee row
    const merged = (empRes.data || []).map((emp) => ({
      ...emp,
      jobdesc: jobMap[emp.empno]?.jobdesc ?? null,
      deptname: jobMap[emp.empno]?.deptname ?? null,
    }));

    return { data: merged, error: null };
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
export const updateEmployee = async (empNo, updateData) => {
  try {
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
export const softDeleteEmployee = async (empNo) => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .update({ record_status: 'INACTIVE' })
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
 * Recovers a deleted employee by setting record_status to 'ACTIVE'.
 * 
 * @param {number | string} empNo - Employee number to recover
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const recoverEmployee = async (empNo) => {
  try {
    const { data, error } = await supabase
      .from('employee')
      .update({ record_status: 'ACTIVE' })
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
