import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee, User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 border border-line shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-dark-coffee text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <Coffee size={24} />
          </div>
          <span className="eyebrow justify-center mb-2">Create Account</span>
          <h1 className="font-display text-3xl font-medium text-espresso">Join Café Aroma</h1>
          <p className="text-xs text-ink-muted mt-1">
            Enjoy personalized ordering, table bookings and circle perks.
          </p>
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
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="text"
                name="name"
                required
                placeholder="Sophia Patel"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream/30 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream/30 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1.5">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream/30 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cream/30 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cafe btn-primary text-xs py-3 tracking-widest font-bold shadow-md flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-ink-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-caramel hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
