import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JobHistoryPanel from '../components/JobHistoryPanel';
import { getEmployee } from '../services/employeeService';
import { getEmployeeCurrentJobById, getEmployeeFullHistory, downloadPDF } from '../services/reportService';
import { useRights } from '../context/UserRightsContext';

export default function EmployeeDetailPage() {
  const { id } = useParams(); // id is actually emp_no from URL
  const navigate = useNavigate();
  const { currentUser } = useRights();
  const userRole = currentUser?.user_type || 'USER';
  const [employee, setEmployee] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async () => {
    if (!employee) return;
    setExportLoading(true);
    try {
      const { data: history } = await getEmployeeFullHistory(employee.empno);
      const rows = (history || []).map(r => [
        r.eff_date || r.effdate || 'N/A',
        r.jobcode || r.job_code || 'N/A',
        r.jobdesc || r.job_desc || 'N/A',
        r.deptname || r.dept_name || r.deptcode || 'N/A',
        `$${(r.salary || 0).toLocaleString()}`,
      ]);
      downloadPDF(
        ['Effective Date', 'Job Code', 'Job Description', 'Department', 'Salary'],
        rows,
        `Employee Details: ${employee.firstname} ${employee.lastname} (#${employee.empno})`,
        `employee-${employee.empno}-details.pdf`
      );
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [empRes, jobRes] = await Promise.all([
          getEmployee(id, currentUser?.user_type || 'USER'),
          getEmployeeCurrentJobById(id),
        ]);
        if (empRes.error) {
          setError(empRes.error.message);
          setEmployee(null);
        } else {
          setEmployee(empRes.data);
          setCurrentJob(jobRes.data || null);
        }
      } catch (err) {
        setError(err.message);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [id]);

  const profile = employee ? {
    id: employee.empno,
    firstName: employee.firstname || 'N/A',
    lastName: employee.lastname || 'N/A',
    joined: employee.hiredate
      ? new Date(employee.hiredate + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : 'Not specified',
    role: currentJob?.jobdesc || currentJob?.job_desc || 'Not assigned',
    dept: currentJob?.deptname || currentJob?.dept_name || 'Not assigned',
    status: employee.record_status === 'ACTIVE' ? 'Active' : 'Inactive',
    empNo: employee.empno
  } : null;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Back Header */}
      <button 
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Directory</span>
      </button>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto mb-4"></div>
            <p className="text-zinc-500">Loading employee profile...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <p className="text-red-400 font-bold">Error loading employee: {error}</p>
        </div>
      )}

      {/* Profile Content */}
      {!loading && profile && (
        <>
          {/* Profile Header Block */}
          <section className="bg-[#1A1A24]/60 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden mb-8">
            {/* Background Accents */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2E5BFF]/10 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              {/* Avatar with Status Ring */}
              <div className="relative shrink-0">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-[#2E5BFF] to-[#B71BCF] shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0B0B0F] border-4 border-[#1A1A24]">
                    <img 
                      alt="Profile" 
                      className="w-full h-full object-cover grayscale-[20%]" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-aAbU3k2muH2IvxwHNrFLnV6yqIDBfoT7la7qLMhN-5QnUTVsoLH2WpqXupBTQITFYCpAwoeDSCZfQsux6gWwJwlpQRhMEtc29P4TZ1L-YGlP7X45aiZJUvIcauu2xHVkyDn22sl1MbWYRHw2bw8bIgkhQoEpoFnfk0wDTKe82rHo7J_iTT2KQiTv_CSktBnyj4aFOn52It6HNLYOfwoMipeb8wScJKb5-hD34hqtj6pNM9TSRuErQAkh94OEZg3h2_Tyc_buORAO" 
                    />
                  </div>
                </div>
                <span className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[#00ffcc] border-4 border-[#1A1A24] shadow-[0_0_15px_rgba(0,255,204,0.4)]"></span>
              </div>

              <div className="flex-grow space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <h1 className="text-4xl font-black text-white tracking-tight">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                    {profile.status}
                  </span>
                </div>
                
                <p className="text-xl text-zinc-400 font-bold">{profile.role}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold">
                    <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                    Hired on {profile.joined}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              { label: "Employee No", val: profile.empNo, icon: "badge", sub: "System ID" },
              { label: "Department", val: profile.dept, icon: "apartment", sub: "Assigned Department" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#1A1A24] p-8 rounded-[2rem] border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
                  <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                </div>
                <h4 className="text-3xl font-black text-white mb-1">{stat.val}</h4>
                <p className="text-[11px] text-zinc-600 font-bold">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Export Employee Details */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {exportLoading
                ? <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                : <span className="material-symbols-outlined text-base">download</span>
              }
              {exportLoading ? 'Generating...' : 'Export Employee Details'}
            </button>
          </div>

          {/* THE EMBEDDED PANEL */}
          <JobHistoryPanel empNo={profile.empNo} userRole={userRole} />
        </>
      )}

      {!loading && !profile && !error && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <p className="text-yellow-400 font-bold">Employee not found. Please check the employee ID and try again.</p>
        </div>
      )}
    </div>
  );
}