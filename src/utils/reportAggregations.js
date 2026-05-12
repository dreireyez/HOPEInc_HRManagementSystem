export const getHeadcount = (row) => row.activeheadcount ?? row.headcount ?? row.count ?? 0;
export const getDeptName = (row) => row.deptname ?? row.dept_name ?? 'Unknown';

export const calculateTotalHeadcount = (headcountData) => {
  return headcountData.reduce((sum, d) => sum + getHeadcount(d), 0);
};

export const calculateHeadcountPercentage = (count, totalHeadcount) => {
  if (totalHeadcount === 0) return '0.0';
  return ((count / totalHeadcount) * 100).toFixed(1);
};
