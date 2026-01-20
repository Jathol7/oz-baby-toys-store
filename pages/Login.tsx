import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Passes the credentials to the context we fixed earlier
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      // 422 Fix: Extracting the specific error from your team's API
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        // If there's an email error (like "Invalid credentials"), show that, else show general message
        const firstError = errors ? Object.values(errors)[0] : null;
        setError(Array.isArray(firstError) ? firstError[0] : err.response.data.message || 'Invalid email or password.');
      } else if (err.response && err.response.status === 401) {
        setError('Unauthorized: Please check your credentials.');
      } else {
        setError('Something went wrong. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800">Welcome Back!</h2>
          <p className="text-slate-500 mt-2">Login to your account to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3 border-l-4 border-red-500">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="email" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                placeholder="admin@toys.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-300 text-slate-900 font-extrabold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 font-medium">
          Don't have an account? <Link to="/register" className="text-pink-500 hover:underline font-bold">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;