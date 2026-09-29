import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee, Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from);
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillSuperadmin = () => {
    setEmail('superadmin@cafearoma.com');
    setPassword('superadmin123');
    setError(null);
  };

  const fillAdmin = () => {
    setEmail('admin@cafearoma.com');
    setPassword('admin123');
    setError(null);
  };

  const fillCustomer = () => {
    setEmail('customer@example.com');
    setPassword('customer123');
    setError(null);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 border border-line shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-dark-coffee text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <Coffee size={24} />
          </div>
          <span className="eyebrow justify-center mb-2">Welcome Back</span>
          <h1 className="font-display text-3xl font-medium text-espresso">Sign in to Aroma</h1>
          <p className="text-xs text-ink-muted mt-1">Access your saved orders, table reservations &amp; profile.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream/30 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream/30 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cafe btn-primary text-xs py-3 tracking-widest font-bold shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="mt-8 pt-6 border-t border-line">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-center text-ink-muted mb-3">
            Quick Test Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={fillSuperadmin}
              className="flex items-center justify-center gap-1 py-2 px-1 rounded border border-line hover:border-gold hover:bg-gold/10 text-espresso text-[10px] font-semibold transition"
            >
              <ShieldCheck size={12} className="text-gold" />
              <span>Superadmin</span>
            </button>
            <button
              type="button"
              onClick={fillAdmin}
              className="flex items-center justify-center gap-1 py-2 px-1 rounded border border-line hover:border-gold hover:bg-gold/10 text-espresso text-[10px] font-semibold transition"
            >
              <ShieldCheck size={12} className="text-gold" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={fillCustomer}
              className="flex items-center justify-center gap-1 py-2 px-1 rounded border border-line hover:border-caramel hover:bg-cream/60 text-espresso text-[10px] font-semibold transition"
            >
              <User size={12} className="text-caramel" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-ink-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-caramel hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
