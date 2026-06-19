import React, { useState } from 'react';
import { ShieldAlert, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MaintenanceScreenProps {
  onVerifySuccess: (role: 'Admin' | 'Editor') => void;
}

export function MaintenanceScreen({ onVerifySuccess }: MaintenanceScreenProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const userClean = username.trim().toLowerCase();
    const pass = password.trim();

    const isAdminValid = (userClean === 'admin' || userClean === 'ceo@ptsglobal.com') && (pass === 'admin login' || pass === 'admin123' || pass === 'admin' || pass === 'PTS');
    const isEditorValid = userClean === 'editor' && (pass === 'editor123' || pass === 'editor');

    if (isAdminValid || isEditorValid) {
      alert('ভেরিফিকেশন সফল! প্যানেল ওপেন হচ্ছে...');
      const role = isAdminValid ? 'Admin' : 'Editor';
      onVerifySuccess(role);
    } else {
      setErrorMessage('ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      <style>{`
        .gears-container {
            position: relative;
            width: 150px;
            height: 150px;
            margin: 0 auto 30px;
        }
        .gear {
            position: absolute;
            border: 8px solid #db2777;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin-clockwise 2.5s linear infinite;
        }
        .gear.large {
            width: 100px;
            height: 100px;
            top: 10px;
            left: 10px;
            border-color: #2c3e50;
            border-top-color: transparent;
        }
        .gear.small {
            width: 60px;
            height: 60px;
            bottom: 10px;
            right: 15px;
            border-color: #db2777;
            border-top-color: transparent;
            animation: spin-counterclockwise 1.5s linear infinite;
        }
        @keyframes spin-clockwise {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
        }
      `}</style>

      {/* Secret Admin Verification Trigger */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setShowLogin(!showLogin)}
          className="flex items-center gap-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer shadow-sm border border-slate-200/50"
          type="button"
        >
          <span>🔒 Admin Verify</span>
        </button>
      </div>

      {/* Main Beautiful Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center relative z-10 animate-fade-in">
        <div className="gears-container">
          <div className="gear large"></div>
          <div className="gear small"></div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
          সাময়িক কিছু সময়ের জন্য এক্সেস বন্ধ আছে
        </h1>
        <p className="text-base text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          ওয়েবসাইট আপডেটের কাজ চলছে। দয়া করে কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-450 text-xs font-semibold">
          <ShieldAlert size={14} className="text-pink-650" />
          <span>Royal Palace BD - Smart Maintenance Panel</span>
        </div>
      </div>

      {/* Modern Pop-up / Drawer Form for Admin Bypass */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          >
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-left relative">
              <button 
                onClick={() => { setShowLogin(false); setErrorMessage(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-850 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
                type="button"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-850">এডমিন লগইন</h3>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Access Verification</p>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">ইউজারনেম (Admin/Editor)</label>
                  <input 
                    type="text" 
                    placeholder="ইউজারনেম (Admin/Editor)" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">গোপন পাসওয়ার্ড</label>
                  <input 
                    type="password" 
                    placeholder="গোপন পাসওয়ার্ড" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition text-sm text-slate-800"
                    required
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100 select-none">
                    ⚠️ {errorMessage}
                  </p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-pink-600 text-white font-extrabold py-3.5 px-6 rounded-xl mt-2 transition duration-300 shadow-md tracking-wide text-xs uppercase cursor-pointer"
                >
                  ভেরিফাই করুন
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
