import React, { useState } from 'react';
import { Smartphone, Lock, Mail, Key, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white font-sans antialiased overflow-y-auto">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-[#80ddff] flex items-center justify-center text-slate-950 shadow-xl shadow-sky-500/20 border border-sky-300">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {storeSettings?.shopName || 'PhoneVault Pro Enterprise'}
          </h1>
          <p className="text-xs text-sky-200 font-semibold tracking-wider uppercase">
            Personal Owner Management & Audit Portal
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-200 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-200 mb-1.5">
              Owner Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sky-300 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phonevault.tz"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-300 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-white placeholder-sky-300/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#0284c7] hover:bg-sky-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 border border-sky-400/30"
          >
            {loading ? (
              'Inahakiki Taarifa...'
            ) : (
              <>
                <span>Ingia Mfumoni (Login)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Autofill Helper */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <div className="text-[11px] text-sky-200/80 font-medium">
            Je, ungependa kuingia haraka kujaribu mfumo?
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-sky-200 border border-white/10 inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Auto-fill Demo Owner Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
