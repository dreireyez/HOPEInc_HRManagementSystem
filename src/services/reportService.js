import supabase from '../lib/supabaseClient.js';

/**
 * Fetch headcount aggregated by department.
 * Targets the 'headcount_by_dept' view.
 * 
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getHeadcountByDept = async () => {
  try {
    const { data, error } = await supabase
      .from('headcount_by_dept')
      .select('*');

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Fetch salary summary aggregated by job role.
 * Targets the 'salary_summary_by_job' view.
 * 
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getSalarySummaryByJob = async () => {
  try {
    const { data, error } = await supabase
      .from('salary_summary_by_job')
      .select('*');

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Fetch all job history records for a specific employee, joined with job and department details.
 * Targets the 'employee_full_history' view.
 * 
 * @param {string | number} empNo - Employee number to fetch history for
 * @returns {Promise<{data: Array | null, error: null | Error}>}
 */
export const getEmployeeFullHistory = async (empNo) => {
  try {
    const { data, error } = await supabase
      .from('employee_full_history')
      .select('*')
      .eq('empno', empNo)
      .order('effdate', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
