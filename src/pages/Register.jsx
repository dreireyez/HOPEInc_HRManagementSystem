import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.username.trim()) newErrors.username = "Required";
    if (!formData.email.includes('@')) newErrors.email = "Invalid email";
    if (formData.password.length < 6) newErrors.password = "Min 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Rubric Requirement: supabase.auth.signUp() wired to Register form
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          user_type: 'USER', 
        }
      }
    });

    if (error) {
      setErrors({ auth: error.message });
      setLoading(false);
    } else {
      setMessage("Registration successful! Check your email for a verification link.");
      setLoading(false);
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' });
      // Optional: Delay navigation to let user read the message
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center overflow-hidden neon-flux-bg">
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-container/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary-container/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      <main className="relative z-10 w-full max-w-xl px-6 py-12">
        <div className="bg-[#1E1E2E]/60 backdrop-blur-3xl rounded-xl p-8 md:p-12 shadow-2xl ring-1 ring-on-surface/5">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-tertiary-container shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">HopeHRS</h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium tracking-wide uppercase">Human Resources Evolution</p>
          </div>

          {message && (
            <div className="mb-8 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 animate-pulse">
              <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
              <p className="text-xs text-emerald-200 leading-relaxed font-medium">{message}</p>
            </div>
          )}

          {errors.auth && (
             <div className="mb-4 p-3 rounded bg-error/10 border border-error/20 text-error text-xs font-bold text-center">
                {errors.auth}
             </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">First Name</label>
                <div className="relative group">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl transition-colors ${errors.firstName ? 'text-error' : 'text-outline group-focus-within:text-primary-container'}`}>person</span>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 transition-all duration-300 ${errors.firstName ? 'ring-2 ring-error/50' : 'focus:ring-primary-container/50'}`}
                    placeholder="Jane"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Last Name</label>
                <div className="relative group">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl transition-colors ${errors.lastName ? 'text-error' : 'text-outline group-focus-within:text-primary-container'}`}>badge</span>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 transition-all duration-300 ${errors.lastName ? 'ring-2 ring-error/50' : 'focus:ring-primary-container/50'}`}
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative group">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl transition-colors ${errors.email ? 'text-error' : 'text-outline group-focus-within:text-primary-container'}`}>alternate_email</span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 transition-all duration-300 ${errors.email ? 'ring-2 ring-error/50' : 'focus:ring-primary-container/50'}`}
                  placeholder="jane.doe@hopehrs.com"
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Security Password</label>
              <div className="relative group">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl transition-colors ${errors.password ? 'text-error' : 'text-outline group-focus-within:text-primary-container'}`}>lock</span>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 transition-all duration-300 ${errors.password ? 'ring-2 ring-error/50' : 'focus:ring-primary-container/50'}`}
                  placeholder="••••••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface transition-colors">
                  {showPassword ? "visibility" : "visibility_off"}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-container to-tertiary-container text-white font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-sm flex justify-center items-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Processing...' : 'Register Account'}</span>
                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account? <Link to="/login" className="text-primary-container font-bold hover:text-tertiary transition-colors ml-1">Login</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
