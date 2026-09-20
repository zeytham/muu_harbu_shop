import React, { useState } from 'react';
import { Smartphone, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPortal({ onLoginSuccess, storeSettings }) {
  const [email, setEmail] = useState('admin@phonevault.tz');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('phonevault_token', data.token);
        localStorage.setItem('phonevault_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.message || 'Kuingia kumedumaa. Angalia Email au Password.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Hitilafu ya mtandao: Shida ya kuunganisha na server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@phonevault.tz');
    setPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 text-slate-900 font-sans antialiased overflow-y-auto">
      {/* Main Login Card - Clean Slate Enterprise Design */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 mx-auto rounded-xl bg-[#0284c7] flex items-center justify-center text-white shadow-md">
            <Smartphone className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {storeSettings?.shopName || 'PhoneVault Pro Enterprise'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Management & POS System Access
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phonevault.tz"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0284c7] hover:bg-sky-700 text-white font-bold text-xs transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Inahakiki...'
            ) : (
              <>
                <span>Ingia Mfumoni (Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Autofill Helper */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-xs font-bold text-sky-700 hover:text-sky-900"
          >
            Fill Demo Owner Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
