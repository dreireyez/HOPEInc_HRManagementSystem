import { useParams, useNavigate } from 'react-router-dom';
import JobHistoryPanel from '../components/JobHistoryPanel';

export default function EmployeeDetailPage({ userRole = 'ADMIN' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Profile Data (In Sprint 2, this will come from a Supabase join)
  const profile = {
    id: id || '8291',
    firstName: 'Marcus',
    lastName: 'Thorne',
    email: 'm.thorne@hopehrs.com',
    location: 'Remote, London',
    joined: 'May 2021',
    role: 'Tech Lead',
    dept: 'Product Infrastructure',
    status: 'Active'
  };

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
            
            <p className="text-xl text-zinc-400 font-bold">{profile.role} — <span className="text-zinc-600">{profile.dept}</span></p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold">
                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                {profile.email}
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                {profile.location}
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold">
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                Joined {profile.joined}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Performance", val: "Top 5%", icon: "trending_up", sub: "2023 Consistency Score" },
          { label: "Tenure", val: "2.8 Yrs", icon: "verified", sub: "Avg. Dept Stability" },
          { label: "Equity", val: "Vesting", icon: "account_balance_wallet", sub: "65% Vested Options" }
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

      {/* THE EMBEDDED PANEL */}
      <JobHistoryPanel userRole={userRole} />
    </div>
  );
}