import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '', // Added this for backend requirement
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Frontend validation: Check if passwords match before even calling the API
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // 1. Register the user with all 4 fields
      await register(formData);
      
      // 2. Automatically login after registration
      await login({ email: formData.email, password: formData.password });
      
      navigate('/');
    } catch (err: any) {
      // Capture specific backend error messages
      setError(err.response?.data?.message || 'Registration failed. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800">Create Account</h2>
          <p className="text-slate-500 mt-2">Join our community for your little one</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium mb-6 border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="text" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="email" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="example@ozbaby.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Confirm Password (REQUIRED FOR YOUR API) */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Account...' : <><UserPlus size={20} /> Register Now</>}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-yellow-500 hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;