import supabase from '../lib/supabaseClient.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
/**
 * Fetch the current job record for a single employee from the employee_current_job view.
 * Returns deptname, jobdesc, deptcode, jobcode, salary, and currenteffdate.
 *
 * @param {string | number} empNo - Employee number
 * @returns {Promise<{data: Object | null, error: null | Error}>}
 */
export const getEmployeeCurrentJobById = async (empNo) => {
  try {
    const { data, error } = await supabase
      .from('employee_current_job')
      .select('*')
      .eq('empno', empNo)
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const getEmployeeCurrentJob = async (userType) => {
  try {
    const { data, error } = await supabase
      .from('employee_current_job')
      .select('empno, deptcode');
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const getEmployeeFullHistory = async (empNo) => {
  try {
    const { data, error } = await supabase
      .from('employee_full_history')
      .select('*')
      .eq('empno', empNo);

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Generates a PDF document with a titled table and triggers a browser download.
 *
 * @param {string[]} columns - Column header labels.
 * @param {(string|number)[][]} rows - Table rows, each an array matching the column order.
 * @param {string} title - Document title rendered at the top of the PDF.
 * @param {string} filename - Suggested filename including the .pdf extension.
 */
export function downloadPDF(columns, rows, title, filename) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26);
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 32,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [46, 91, 255], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 250] },
  });
  doc.save(filename);
}

/**
 * Renders the three HR analytics datasets into a single multi-section PDF.
 * Sections: Headcount by Department, Salary Summary by Job, Hires per Month.
 *
 * @param {Object} payload
 * @param {Array<{label: string, count: number}>} payload.headcount
 * @param {Array<Object>} payload.salary - rows from salary_summary_by_job view
 * @param {Array<{label: string, count: number}>} payload.hires
 * @param {string} [filename='hr-combined-report.pdf']
 */
export function downloadCombinedReportsPDF({ headcount = [], salary = [], hires = [] }, filename = 'hr-combined-report.pdf') {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HR Analytics Report', 14, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Headcount by Department', 14, 36);
  autoTable(doc, {
    head: [['Department', 'Headcount']],
    body: headcount.map(d => [d.label || d.dept_name || d.deptname || 'Unknown', d.count ?? d.headcount ?? 0]),
    startY: 40,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [46, 91, 255], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 250] },
  });

  let nextY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Salary Summary by Job', 14, nextY);
  autoTable(doc, {
    head: [['Job Description', 'Min', 'Max', 'Avg']],
    body: salary.map(r => [
      r.job_desc || r.jobdesc || r.job_title || 'N/A',
      `$${(r.min_salary || r.minsalary || 0).toLocaleString()}`,
      `$${(r.max_salary || r.maxsalary || 0).toLocaleString()}`,
      `$${(r.avg_salary || r.avgsalary || 0).toLocaleString()}`,
    ]),
    startY: nextY + 4,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [183, 27, 207], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 245, 250] },
  });

  nextY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Hires per Month', 14, nextY);
  autoTable(doc, {
    head: [['Month', 'Hires']],
    body: hires.map(h => [h.label, h.count]),
    startY: nextY + 4,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [0, 200, 160], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 250, 248] },
  });

  doc.save(filename);
}

/**
 * Converts an array of row objects to a CSV string and triggers a browser download.
 * Column headers are derived from the keys of the first row.
 *
 * @param {Object[]} rows - Dataset to export.
 * @param {string} filename - Suggested filename including the .csv extension.
 */
export function downloadCSV(rows, filename) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]).join(',');
  const body = rows
    .map(r =>
      Object.values(r)
        .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');
  const blob = new Blob([headers + '\n' + body], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
