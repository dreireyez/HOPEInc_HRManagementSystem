import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportTableToPDF = (title, columns, data, filename = 'report.pdf') => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [columns],
    body: data,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  doc.save(filename);
};

export const exportEmployeeProfilePDF = (profile, historyData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(40);
  doc.text(`${profile.firstName} ${profile.lastName}`, 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`${profile.role} - ${profile.dept}`, 14, 30);
  
  doc.setFontSize(10);
  doc.text(`Employee ID: EMP-${profile.empNo} | Status: ${profile.status}`, 14, 36);

  // Profile Details Box
  autoTable(doc, {
    startY: 42,
    head: [['Profile Information', '']],
    body: [
      ['Email', profile.email || 'N/A'],
      ['Phone', profile.phone || 'N/A'],
      ['Manager', profile.manager || 'N/A'],
      ['Hire Date', profile.joined || 'N/A'],
      ['Gender', profile.gender || 'N/A'],
      ['Birthdate', profile.birthdate || 'N/A']
    ],
    theme: 'plain',
    styles: { cellPadding: 2, fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 }
    }
  });

  const finalY = doc.lastAutoTable.finalY || 80;

  // History Data
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text('Career Progression Timeline', 14, finalY + 12);

  const historyColumns = ['Effective Date', 'Job Description', 'Department', 'Salary'];
  const historyRows = historyData.map(node => [
    node.eff_date || node.effdate || 'N/A',
    node.job_desc || node.jobdesc || node.job_title || 'N/A',
    node.dept_name || node.deptname || 'N/A',
    `$${(node.salary || 0).toLocaleString()}`
  ]);

  if (historyRows.length > 0) {
    autoTable(doc, {
      startY: finalY + 18,
      head: [historyColumns],
      body: historyRows,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('No history records found for this employee.', 14, finalY + 18);
  }

  doc.save(`Employee_Profile_${profile.empNo}.pdf`);
};
