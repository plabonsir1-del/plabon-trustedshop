import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Send, CheckCircle, Lock } from 'lucide-react';

interface AccountVerificationProps {
  onVerify: (data: any) => void;
  title?: string;
  onBack?: () => void;
}

export function AccountVerification({ onVerify, title = "Account Verification", onBack }: AccountVerificationProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('auth-', '')]: value }));
  };

  const sendVerificationCode = async () => {
    if (!formData.email) {
      alert('Please enter your email');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, username: formData.username, password: formData.password })
      });
      const data = await response.json();
      if (data.success) {
        setStep('otp');
      } else {
        alert(data.error || 'Failed to send code');
      }
    } catch (error) {
      console.error(error);
      alert('Network error - check server');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpToVerify = formData.otp.trim();
    if (otpToVerify.length < 4) {
      alert('Please enter a valid verification code');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp_code: otpToVerify })
      });
      
      const data = await response.json().catch(() => ({ error: 'Invalid server response' }));
      
      if (response.ok && data.success) {
        onVerify(data);
      } else {
        // Specifically handle the case of wrong code
        const errorMessage = data.error || 'ভুল ভেরিফিকেশন কোড! দয়া করে সঠিক কোডটি দিন।';
        alert(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('⚠️ কানেকশন এরর! দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-section" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl shadow-3xl rounded-3xl w-full max-w-md p-8 border border-white/50"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <ShieldCheck size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        
        <AnimatePresence mode="wait">
          {step === 'credentials' ? (
            <motion.div 
              key="credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Username</label>
                <input 
                  type="text" 
                  id="auth-username" 
                  placeholder="e.g., global_seller7" 
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  id="auth-email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <input 
                  type="password" 
                  id="auth-password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-slate-50"
                />
              </div>
              <button 
                onClick={sendVerificationCode}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                     <Send size={20} />
                  </motion.div>
                ) : (
                  <>
                    <Send size={20} />
                    Send Verification Code
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle className="text-emerald-500 mx-auto mb-2" size={24} />
                <p className="text-sm font-medium text-emerald-800">Verification code sent to your email!</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Verification Code (OTP)</label>
                <input 
                  type="text" 
                  id="auth-otp" 
                  placeholder="000000" 
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-slate-50 text-center tracking-[0.5em] font-bold text-2xl"
                />
              </div>

              <button 
                onClick={verifyOTP}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? "Verifying..." : "Verify & Log In"}
              </button>

              <button 
                onClick={() => setStep('credentials')}
                className="w-full text-slate-500 font-medium text-sm hover:text-indigo-600 transition-colors"
              >
                Back to credentials
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
