import React, { useState, useEffect } from 'react';
import { X, Send, Smartphone, CheckCircle, Clock, MessageSquare, RefreshCw } from 'lucide-react';

export default function SmsNotificationModal({ onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState('0624945919');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchSmsLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sms');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsLogs();
  }, []);

  const handleSendCustomSms = async (e) => {
    e.preventDefault();
    if (!recipient || !message) {
      alert('Tafadhali jaza Namba ya Simu na Ujumbe wa SMS');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, message, type: 'CUSTOM' }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`🎉 SMS imetumwa kikamilifu kwenda kwa ${recipient}!`);
        setMessage('');
        fetchSmsLogs();
      } else {
        alert('Hitilafu: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Imefeli kutuma SMS');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Automated SMS Notification Gateway</h2>
              <p className="text-xs text-sky-200 font-medium">Kutuma SMS za Low Stock, POS Receipts, na RMA Swaps</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-sky-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {/* Quick Custom SMS Form */}
          <form onSubmit={handleSendCustomSms} className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-3">
            <div className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-700" /> Tuma Test SMS Kwa Namba Yoyote (Custom SMS Dispatch)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Namba ya Mpelekewa (+255...)</label>
                <input
                  type="text"
                  required
                  placeholder="+255 712 345 678"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Ujumbe wa SMS (SMS Message Body)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Taarifa ya Low Stock au Risiti ya Mteja..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1"
                  >
                    {sending ? 'Inatuma...' : 'Tuma SMS'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* SMS Logs History Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Historia Ya SMS Zilizotumwa (SMS Dispatch History Logs)
              </h3>
              <button
                onClick={fetchSmsLogs}
                className="p-1.5 text-xs text-sky-700 font-bold hover:bg-sky-50 rounded-lg flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
              </button>
            </div>

            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3.5 bg-white rounded-2xl border border-sky-100 shadow-sm space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{log.recipient}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          log.type === 'LOW_STOCK'
                            ? 'bg-rose-100 text-rose-800'
                            : log.type === 'POS_RECEIPT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {log.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.sentAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-600 font-medium">{log.message}</p>

                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Delivered via Enterprise SMS Gateway
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
