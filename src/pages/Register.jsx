import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering account:", formData);
  };

  const handleGoogleRegister = () => {
    console.log("Initiating Google OAuth Registration");
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center overflow-hidden neon-flux-bg">
      
      {/* Decorative Background Orbs (Matched to Login) */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-container/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary-container/10 blur-[150px] rounded-full z-0 pointer-events-none"></div>

      {/* Slightly wider max-width (max-w-xl) to accommodate the name grid */}
      <main className="relative z-10 w-full max-w-xl px-6 py-12">
        {/* Glassmorphic Register Card (Exact match to Login) */}
        <div className="bg-[#1E1E2E]/60 backdrop-blur-3xl rounded-xl p-8 md:p-12 shadow-2xl ring-1 ring-on-surface/5">
          
          {/* Brand Identity */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-tertiary-container shadow-lg">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                fluid
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2E5BFF] to-[#B71BCF] bg-clip-text text-transparent">
              HopeHRS
            </h1>
            <p className="text-on-surface-variant text-sm mt-2 font-medium tracking-wide uppercase">
              Human Resources Evolution
            </p>
          </div>

          {/* Provisioning Alert */}
          <div className="mb-8 p-4 rounded-lg bg-secondary-container/10 border border-secondary-container/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              info
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
              New accounts are subject to admin activation. Your status will remain inactive until manually provisioned by the HR department.
            </p>
          </div>

          {/* Register Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            
            {/* Name Row Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">First Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary-container transition-colors">
                    person
                  </span>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                    placeholder="Jane"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Last Name</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary-container transition-colors">
                    badge
                  </span>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Username</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary-container transition-colors">
                  account_circle
                </span>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                  placeholder="janedoe_hr"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary-container transition-colors">
                  alternate_email
                </span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                  placeholder="jane.doe@hopehrs.com"
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">Security Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl group-focus-within:text-primary-container transition-colors">
                  lock
                </span>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border-none rounded-lg py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary-container/50 transition-all duration-300"
                  placeholder="••••••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline hover:text-on-surface transition-colors"
                >
                  {showPassword ? "visibility" : "visibility_off"}
                </button>
              </div>
            </div>

            {/* Primary Register Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-container to-tertiary-container text-white font-bold py-4 rounded-full shadow-lg shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-sm flex justify-center items-center gap-2"
              >
                <span>Register Account</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-outline-variant/20"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-[0.2em]">or</span>
              <div className="flex-grow border-t border-outline-variant/20"></div>
            </div>

            {/* Social Registration */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 bg-surface-variant/50 hover:bg-surface-variant text-on-surface font-semibold py-4 rounded-lg transition-colors border border-outline-variant/10"
            >
              <img
                alt="Google Logo"
                className="w-5 h-5"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              />
              <span className="text-sm tracking-tight">Register with Google</span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-container font-bold hover:text-tertiary transition-colors ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Credits */}
        <footer className="mt-12 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-outline">
            © 2026 Hope, Inc. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Side Decoration: Data Stream (Exact match to Login) */}
      <div className="hidden lg:block fixed left-12 top-1/2 -translate-y-1/2 space-y-8 pointer-events-none">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary-container to-transparent opacity-30"></div>
        <div className="text-[10px] [writing-mode:vertical-lr] text-outline-variant tracking-[0.5em] font-bold uppercase">System Integrity: Nominal</div>
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-tertiary-container to-transparent opacity-30"></div>
      </div>
    </div>
  );
}