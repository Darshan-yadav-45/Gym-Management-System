import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { authService } from '../services/authService';

/**
 * AdminLogin — dedicated login page at /admin/login.
 *
 * Reuses the existing authService.login() and JWT authentication flow.
 * After a successful login it checks the role in the server response:
 *   - ADMIN  → redirects to /admin/dashboard
 *   - Others → clears the token and shows an access-denied message.
 *
 * Admin credentials are configured server-side via environment variables.
 * No passwords are stored in frontend code.
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect already-authenticated admins immediately
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);

      if (response.user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Non-admin credentials: clear token immediately and deny access
        authService.logout();
        setError(
          'Access Denied — administrator credentials required. ' +
          'If you are a member, please use the standard login page.'
        );
      }
    } catch (err) {
      let msg = 'Login failed. Please check your administrator credentials.';
      if (!err.response) {
        msg = 'Cannot connect to the backend server. Please verify Spring Boot is running on port 8080.';
      } else if (err.response.status === 401 || err.response.status === 403) {
        msg = 'Invalid email or password.';
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      } else if (typeof err.response.data === 'string') {
        msg = err.response.data;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-200 font-sans flex flex-col selection:bg-[#ef233c] selection:text-white">

      {/* Top bar */}
      <header className="bg-[#14151b] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black tracking-[0.15em] text-white">
            FIT<span className="text-[#ef233c] font-bold italic">FLOW</span>
          </span>
          <span className="bg-red-500/20 text-[#ef233c] border border-[#ef233c]/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Admin Console
          </span>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Member Login
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ef233c] to-[#d90429] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-900/50">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#ef233c] mb-2">
              SECURE ADMINISTRATOR ACCESS
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
              Admin Login
            </h1>
            <p className="text-gray-400 text-xs">
              Sign in with your administrator credentials to access the FitFlow Admin Console
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-[#ef233c]/15 border border-[#ef233c]/40 text-white rounded-xl text-xs font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ef233c] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          <div className="bg-[#14151b] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                    placeholder="appu12813@gmail.com"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#0b0c10] border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-white focus:outline-none focus:border-[#ef233c] transition-colors text-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="admin-login-submit"
                disabled={loading}
                className="w-full bg-[#ef233c] hover:bg-[#d90429] text-white py-4 rounded-full uppercase tracking-widest font-bold text-xs transition-all duration-300 mt-6 flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(239,35,60,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In as Administrator</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Protected administrator access only. Unauthorised login attempts are logged.
                <br />Admin credentials are configured via server environment variables.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Not an administrator?{' '}
            <Link to="/login" className="text-[#ef233c] hover:text-white transition-colors font-bold">
              Return to member login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
