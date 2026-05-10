import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-6 relative font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(0,102,102,0.1),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(0,76,76,0.08),transparent_22%)]" />
      <Card className="relative z-10 w-full max-w-[500px]" padding="lg">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-container)] flex items-center justify-center shadow-outset-soft mb-4">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fluid</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)] mb-2 tracking-tight">
            HopeHRS
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-xs font-mono uppercase tracking-[0.22em] font-semibold">Account Creation</p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-md shadow-inset bg-[var(--color-success-bg)] text-[var(--color-success-text)] flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {errors.auth && (
          <div className="mb-6 p-4 rounded-md shadow-inset bg-[var(--color-error-container)] text-[var(--color-on-error-container)] flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p className="text-sm font-medium">{errors.auth}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="FIRST NAME"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              placeholder="Jane"
              error={errors.firstName}
            />
            <Input
              label="LAST NAME"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              placeholder="Doe"
              error={errors.lastName}
            />
          </div>

          <Input
            label="USERNAME"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            placeholder="janedoe"
            error={errors.username}
          />

          <Input
            label="EMAIL ADDRESS"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="jane@hopeinc.edu"
            error={errors.email}
          />

          <div className="relative">
            <Input
              label="PASSWORD"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="••••••••••••"
              error={errors.password}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-[37px] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors cursor-pointer rounded-lg p-1"
            >
              <span className="material-symbols-outlined text-sm">{showPassword ? "visibility" : "visibility_off"}</span>
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 mt-2 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Register Account'}
            {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[var(--color-on-surface-variant)] text-sm font-sans font-medium">
            Already have an account? <Link to="/login" className="text-[var(--color-primary-container)] hover:underline underline-offset-4 ml-1">Login</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
